import { Label } from "@/components/ui/label";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarDays,
  User,
  Search,
  ArrowUpDown,
  Mail,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useFilter, usePagination } from "@/hooks";
import type { RootState } from "@/types";
import PaginationControls from "@/components/ui/PaginationControls";
import DetailModal from "@/components/modals/details-modal";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import Skeleton from "react-loading-skeleton";
import { fetchAllClientsApi } from "@/services/agency/get.services";
import { IClientTenant } from "@/types/client.types";
import { handleSendMails } from "@/utils";

const Clients = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClientTenant | null>(
    null
  );
  const [selectedClients, setSelectedClients] = useState<IClientTenant[]>([]);
  const [mail, setMail] = useState({
    emailSubject: "",
    emailMessage: "",
    isSendingEmails: false,
  });

  const [filter, setFilter] = useState({
    query: "",
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const { data, isLoading: isClientsLoading } = useQuery({
    queryKey: ["get-all-clients", page, debouncedFilter],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        include: "details",
      }).toString();
      return fetchAllClientsApi(`?${searchParams}`);
    },
    select: (data) => data?.data.result,
    enabled: !!user.user_id,
  });
  useEffect(() => {
    reset();
  }, [
    debouncedFilter.query,
    debouncedFilter,
    debouncedFilter.sortBy,
    debouncedFilter.sortOrder,
  ]);

  const openClientDetails = (client: IClientTenant) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  const handleSelectClient = (client: IClientTenant, checked: boolean) => {
    if (checked) {
      setSelectedClients((prev) => [...prev, client]);
    } else {
      setSelectedClients((prev) =>
        prev.filter((inv) => inv._id !== client._id)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.clients) {
      setSelectedClients((prev) => {
        const existingIds = prev.map((c) => c._id);
        const newClients = data.clients.filter(
          (c) => !existingIds.includes(c._id)
        );
        return [...prev, ...newClients];
      });
    } else {
      if (data?.clients) {
        const currentPageIds = data.clients.map((inv) => inv._id);
        setSelectedClients((prev) =>
          prev.filter((inv) => !currentPageIds.includes(inv._id))
        );
      }
    }
  };

  const handleSendMail = async () => {
    setMail((prev) => ({ ...prev, isSendingEmails: true }));
    try {
      const emails: string[] = selectedClients.map((client) => client.email);
      await handleSendMails(emails, mail.emailMessage, mail.emailSubject);
      setSelectedClients([]);
      setIsEmailModalOpen(false);
      toast.success("Mail has been successfully sended.");
    } catch (error) {
      console.error("Error sending mails:", error);
      toast.error(
        error.data.message || "Failed to send email. Please try again."
      );
    } finally {
      setMail((prev) => ({ ...prev, isSendingEmails: false }));
    }
  };

  const getSelectedClientsInfo = () => {
    return selectedClients.map((client) => ({
      clientName: client.name,
      email: client.email,
      joinedAt: client.createdAt,
      projects: client.projects,
    }));
  };


  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Client Management", `/agency`],
          ["All Clients", ""],
        ]}
      />
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by client name, client number, or service..."
                    value={filter.query}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, query: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <SelectInput
                placeholder="Joine dDate"
                value={filter.sortBy}
                options={[
                  { label: "Joined Date", value: "createdAt" },
                  { label: "Name", value: "name" },
                ]}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, sortBy: value }))
                }
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                  }))
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => setIsEmailModalOpen(true)}
                disabled={selectedClients.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Mail ({selectedClients.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Clients</span>
              {data?.clients && data?.clients.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      data?.clients
                        ? data.clients.every((c) =>
                            selectedClients.some(
                              (selected) => selected._id === c._id
                            )
                          )
                        : false
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isClientsLoading ? (
              <DataTable
                data={data?.clients || []}
                onRowClick={openClientDetails}
                columns={[
                  {
                    header: "Select",
                    render: (client) => (
                      <Checkbox
                        checked={selectedClients.some(
                          (c) => c._id === client._id
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectClient(client, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ),
                  },
                  {
                    header: "Client",
                    render: (client) => (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">
                            {client.email}
                          </div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: "Joined Date",
                    render: (client) => (
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span className="">
                          {format(new Date(client.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              <Skeleton count={5} height={48} />
            )}
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          totalPages={data?.totalPages || 1}
          onNext={nextPage}
          onPrev={prevPage}
        />

        <DetailModal
          title="Client Details" 
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        >
          {selectedClient && (
            <>
              <div className="flex  justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedClient.createdAt}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Joined At:{" "}
                    {format(new Date(selectedClient.createdAt), "MMM dd, yyyy")}
                  </p>
                  <Badge variant="outline">
                    Pending: $
                    {selectedClient.projects.reduce((acc, item) => {
                      return item.status === "Pending"
                        ? acc + Number(item.service_details.budget)
                        : acc;
                    }, 0)}
                  </Badge>
                </div>
                <Badge>
                  Total Budget $
                  {selectedClient.projects.reduce((acc, item) => {
                    return acc + Number(item.service_details.budget);
                  }, 0)}
                </Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{selectedClient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{selectedClient.email}</span>
                  </div>
                </CardContent>
              </Card>

              {selectedClient.projects.map((service) => (
                <Card
                  key={service._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Badge>{service.status}</Badge>
                        <Badge variant="outline">{service.service_name}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">
                          $
                          {parseInt(
                            service.service_details.budget
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span>
                          {" "}
                          {format(new Date(service.dead_line), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>
                          {format(new Date(service.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedClients([selectedClient]);
                    setIsEmailModalOpen(true);
                    setIsDetailModalOpen(false);
                  }}
                  className=""
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Mail
                </Button>
              </div>
            </>
          )}
        </DetailModal>

        <DetailModal
          title="Send Payment Mail"
          open={isEmailModalOpen}
          onOpenChange={setIsEmailModalOpen}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Selected Clients ({selectedClients.length})
              </h4>
              <div className="max-h-32 overflow-y-auto bg-gray-50 p-3 rounded">
                {getSelectedClientsInfo().map((client, index) => (
                  <div key={index} className="text-sm py-1">
                    <span className="font-medium">{client.clientName}</span> -{" "}
                    {client.email}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="emailSubject">Email Subject</Label>
              <Input
                id="emailSubject"
                value={mail.emailSubject}
                onChange={(e) =>
                  setMail((prev) => ({ ...prev, emailSubject: e.target.value }))
                }
                placeholder="Email subject..."
              />
            </div>

            <div>
              <Label htmlFor="emailMessage">Email Message</Label>
              <textarea
                id="emailMessage"
                value={mail.emailMessage}
                onChange={(e) =>
                  setMail((prev) => ({ ...prev, emailMessage: e.target.value }))
                }
                className="w-full h-64 p-3 border rounded-md resize-none"
                placeholder="Email message..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMail}
                disabled={mail.isSendingEmails}
                className="bg-black"
              >
                {mail.isSendingEmails ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Mail ({selectedClients.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DetailModal>
      </div>
    </>
  );
};

export default Clients;
