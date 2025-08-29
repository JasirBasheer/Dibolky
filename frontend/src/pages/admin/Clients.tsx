import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Search,
  ArrowUpDown,
  Bolt,
  RouteOff,
  UserRound,
} from "lucide-react";
import { format } from "date-fns";
import { useFilter, usePagination } from "@/hooks";
import PaginationControls from "@/components/ui/PaginationControls";
import DetailModal from "@/components/modals/details-modal";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import Skeleton from "react-loading-skeleton";
import { fetchAllClientsApi } from "@/services/admin/get.services";
import { changeClientStatusApi } from "@/services/admin/post.services";
import { toast } from "sonner";
import { IClient } from "@/types/client.types";
import { PaginatedResponse } from "@/types";

const Clients = () => {
  const queryClient = useQueryClient();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  const [filter, setFilter] = useState({
    query: "",
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);
  const { data, isLoading: isClientsLoading } = useQuery<
    PaginatedResponse<IClient>
  >({
    queryKey: ["admin:get-clients", page, debouncedFilter],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        include: "details",
      }).toString();

      const res = await fetchAllClientsApi(`?${searchParams}`);
      return res.data;
    },
    enabled: true,
  });
  console.log(data, "all clients data");

  useEffect(() => {
    reset();
  }, [debouncedFilter]);

  const openClientDetails = (client: IClient) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  const handleBlock = async (client_id: string) => {
    const res = await changeClientStatusApi(client_id);

    if (res.status === 200) {
      queryClient.setQueryData<PaginatedResponse<IClient>>(
        ["admin:get-clients", page, debouncedFilter],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedClients = oldData.data.map((client) =>
            client._id === client_id
              ? { ...client, isBlocked: !client.isBlocked }
              : client
          );

          return { ...oldData, data: updatedClients };
        }
      );
      toast.success("Client status changed successfully");
    }
  };

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Admin", `/admin`],
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
                    placeholder="Search by client name, feature name, or price..."
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
                  { label: "Create At", value: "createdAt" },
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Clients</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isClientsLoading ? (
              <DataTable
                data={data?.data || []}
                onRowClick={openClientDetails}
                columns={[
                  {
                    header: "Name",
                    render: (client) => (
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="font-medium">{client.email}</div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: "Valid Until",
                    render: (client) => (
                      <div className="flex items-center gap-1">
                        <Bolt className="h-4 w-4" />
                        <span className="font-medium">
                          {format(new Date(client.validity), "MMM dd, yyyy")}
                        </span>
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

                  {
                    header: "Actions",
                    render: (client) => (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className=""
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlock(client._id);
                          }}
                        >
                          <RouteOff className="h-7 w-7 rounded-md hover:shadow-md cursor-pointer" />
                          {client.isBlocked ? "UnBlock" : "Block"}
                        </Button>
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
                  <h3 className="text-lg font-semibold font-lazare">
                    {selectedClient.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-lazare font-semibold">
                    created At:{" "}
                    {format(new Date(selectedClient.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-lazare">
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">Name:</span>
                    <span className="font-lazare font-bold">
                      {selectedClient.name}
                    </span>
                  </div>
                  <div className="flex justify-between font-lazare">
                    <span className="font-lazare font-semibold">
                      Description:
                    </span>
                    <span className="font-lazare font-bold">
                      {selectedClient.email}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">Industry:</span>
                    <span className="font-lazare font-bold">
                      {selectedClient.industry}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">
                      Organization Name:
                    </span>
                    <span className="font-lazare font-bold">
                      {" "}
                      {selectedClient.organizationName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">Place:</span>
                    <span className="font-lazare font-bold">
                      {" "}
                      {selectedClient.address.city} ,
                      {selectedClient.address.country}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DetailModal>
      </div>
    </>
  );
};

export default Clients;
