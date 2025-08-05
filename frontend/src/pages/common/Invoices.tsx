import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  DollarSign,
  User,
  Search,
  ArrowUpDown,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useFilter, usePagination } from "@/hooks";
import { InvoiceType, RootState } from "@/types";
import { getInvoices } from "@/services";
import PaginationControls from "@/components/ui/PaginationControls";
import DetailModal from "@/components/modals/details-modal";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import Skeleton from "react-loading-skeleton";
import axios from "@/utils/axios";
import { IRazorpayOrder } from "@/types/payment.types";
import InvoicePDFGenerator from "@/components/common/invoice-pdf-generator";

const Invoices = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [filter, setFilter] = useState({
    query: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const { data, isLoading: isInvoicesLoading, refetch } = useQuery({
    queryKey: ["get-invoices", page, debouncedFilter],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        status: debouncedFilter.status,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
      }).toString();
      return getInvoices(user.role, user.user_id, `?${searchParams}`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
  });

  useEffect(() => {
    reset();
  }, [
    debouncedFilter.query,
    debouncedFilter.status,
    debouncedFilter.sortBy,
    debouncedFilter.sortOrder,
  ]);

  const handlePayInvoice = async (invoiceId: string) => {
    if (user.role != "client") {
      toast.error("Only your client can do this payment.");
      return;
    }

    const response = await axios.get(
      `/api/client/initiate-payment/${invoiceId}`
    );

    const { id: order_id, amount, currency } = response.data.data;

    const options = {
      key: "rzp_test_fKh2fGYnPvSVrM",
      amount: amount,
      currency: currency,
      name: "Invoice Payment",
      description: "Invoice Payment",
      order_id: order_id,
      handler: async (response: IRazorpayOrder) => {
        await axios.post("/api/client/invoice", { response, invoiceId });
        refetch()
        toast.success("transaction success")
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const openInvoiceDetails = (invoice: InvoiceType) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          [
            "Invoice Management",
            `/${user.role == "agency" ? "agency" : "client"}/invoices`,
          ],
          ["All Invoices", ""],
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
                    placeholder="Search by client name, invoice number, or service..."
                    value={filter.query}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, query: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <SelectInput
                placeholder="Filter by status"
                value={filter.status}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Paid", value: "paid" },
                  { label: "Unpaid", value: "unpaid" },
                ]}
                onChange={(value: "all" | "paid" | "unpaid") =>
                  setFilter((prev) => ({ ...prev, status: value }))
                }
              />

              <SelectInput
                placeholder="Sort by"
                value={filter.sortBy}
                options={[
                  { label: "Date Created", value: "createdAt" },
                  { label: "Due Date", value: "dueDate" },
                  { label: "Name", value: "client.clientName" },
                  { label: "Amount", value: "pricing" },
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
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {!isInvoicesLoading ? (
              <DataTable
                data={data.invoices}
                onRowClick={openInvoiceDetails}
                columns={[
                  {
                    header: "Invoice #",
                    render: (invoice) => invoice.invoiceNumber,
                  },
                  {
                    header: "Client",
                    render: (invoice) => (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {invoice.client.clientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.client.email}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Service",
                    render: (invoice) => invoice.service.serviceName,
                  },
                  {
                    header: "Amount",
                    render: (invoice) => (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{invoice.pricing}</span>
                      </div>
                    ),
                  },
                  {
                    header: "Due Date",
                    render: (invoice) => (
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span>
                          {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: "Status",
                    render: (invoice) => (
                      <Badge
                        variant={invoice.isPaid ? "default" : "destructive"}
                      >
                        {invoice.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    ),
                  },

                  ...(user.role === "client"
                    ? [
                        {
                          header: "Actions",
                          render: (invoice) =>
                            !invoice.isPaid && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePayInvoice(invoice._id);
                                }}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay
                              </Button>
                            ),
                        },
                      ]
                    : []),
                ]}
              />
            ) : (
              <Skeleton count={3} height={48} />
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
          title="Invoice Details"
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        >
          {selectedInvoice && (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedInvoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {format(
                      new Date(selectedInvoice.createdAt),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>
                <Badge
                  variant={selectedInvoice.isPaid ? "default" : "destructive"}
                >
                  {selectedInvoice.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{selectedInvoice.client.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{selectedInvoice.client.email}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedInvoice.service.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span>${selectedInvoice.service.details.budget}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${selectedInvoice.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>
                      {format(
                        new Date(selectedInvoice.dueDate),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Org:</span>
                    <span>{selectedInvoice.orgName}</span>
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
                {user.role == "client" &&
                  (!selectedInvoice.isPaid ? (
                    <Button
                      onClick={() => handlePayInvoice(selectedInvoice._id)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" /> Process Payment
                    </Button>
                  ) : (
                    <InvoicePDFGenerator Invoice={selectedInvoice} />
                  ))}
              </div>
            </>
          )}
        </DetailModal>
      </div>
    </>
  );
};

export default Invoices;

     {/* <Card className="shadow-md border-0 bg-white">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Contents
            </CardTitle>

          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <div className="px-6 py-4">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={currentTab} className="mt-0">
              {filteredContent.length === 0 ? (
                <div className="text-center py-16">
                  <Upload className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No content found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchQuery
                      ? "Try a different search term"
                      : "Upload some content to get started"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Content
                        </th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Platform
                        </th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredContent.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleViewContent(item)}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                {item.files &&
                                  item.files.length > 0 &&
                                  (item.files[0].contentType.startsWith(
                                    "video"
                                  ) ? (
                                    <video
                                      src={contentUrls[item.files[0].key]}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        contentUrls[item.files[0].key] ||
                                        "/placeholder.svg"
                                      }
                                      alt={item.files[0].fileName}
                                      className="w-full h-full object-cover"
                                    />
                                  ))}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-800 line-clamp-1">
                                  {item.caption}
                                </span>
                                {item.files && (
                                  <span className="text-xs text-gray-500">
                                    {item.files.length}{" "}
                                    {item.files.length === 1 ? "file" : "files"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {item.platforms.map(
                              (item: IPlatforms, index: number) => {
                                return (
                                  <span
                                    key={index}
                                    className="capitalize text-sm text-gray-600"
                                  >
                                    {item.platform || "Unknown"}{" "}
                                  </span>
                                );
                              }
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-600">
                              {item.createdAt
                                ? formatDate(item.createdAt)
                                : "N/A"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div
                              className="flex items-center justify-end gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewContent(item);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  {item.status === "Pending" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleApproveContent(
                                            item._id as string
                                          )
                                        }
                                      >
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleRejectContent(
                                            item._id as string
                                          )
                                        }
                                      >
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {item.status === "Approved" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleApproveContent(item._id as string)
                                      }
                                    >
                                      Mark as Rejected
                                    </DropdownMenuItem>
                                  )}
                                  {item.status === "Rejected" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRejectContent(item._id as string)
                                      }
                                    >
                                      Mark as Approved
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card> */}