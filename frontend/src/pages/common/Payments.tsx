"use client";

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
  FileDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useFilter, usePagination } from "@/hooks";
import {  RootState } from "@/types";
import { getAllTransactions, getInvoices } from "@/services";
import PaginationControls from "@/components/ui/PaginationControls";
import DetailModal from "@/components/modals/details-modal";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import Skeleton from "react-loading-skeleton";
import axios from "@/utils/axios";
import { ITransactionType } from "@/types/transaction";

const Payments = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ITransactionType | null>(
    null
  );
  const [filter, setFilter] = useState({
    query: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const { data, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["get-transactions", page, debouncedFilter],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        status: debouncedFilter.status,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        type:"invoice_payment"

      }).toString();
      return getAllTransactions(user.role, user.user_id, `?${searchParams}`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
  });

  useEffect(() => {
  reset();
}, [debouncedFilter.query, debouncedFilter.status, debouncedFilter.sortBy, debouncedFilter.sortOrder]);

 

  const openInvoiceDetails = (transaction: ITransactionType) => {
    setSelectedInvoice(transaction);
    setIsDetailModalOpen(true);
  };


  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Invoice Management", `/${user.role == "agency"?"agency":"client"}/invoices/payments`],
          ["All Payments", ""],
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
                placeholder="Sort by"
                value={filter.sortBy}
                options={[
                  { label: "Date Created", value: "createdAt" },
                  { label: "Amount", value: "amount" },
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
          {!isInvoicesLoading
          ? (
            <DataTable
              data={data.transactions}
              onRowClick={openInvoiceDetails}
              columns={[
                {
                  header: "Transactions #",
                  render: (transaction) => transaction._id,
                },
                {
                  header: "Email",
                  render: (transaction) => (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {transaction.email}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Gateway",
                  render: (transaction) => transaction.paymentGateway,
                },
                {
                  header: "Amount",
                  render: (transaction) => (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{transaction.amount}</span>
                    </div>
                  ),
                },
                {
                  header: "Date",
                  render: (transaction) => (
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>
                        {/* {format(new Date(transaction.createdAt), "MMM dd, yyyy")} */}
                      </span>
                    </div>
                  ),
                }
              ]}
            />
          ) : (
            <Skeleton count={3} height={48}/>
          )
          }

          </CardContent>
        </Card>
        <PaginationControls
          page={page}
          totalPages={data?.totalPages || 1}
          onNext={nextPage}
          onPrev={prevPage}
        />

        <DetailModal
          title="Details"
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        >
          {selectedInvoice && (
            <>


              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Transaction Info</CardTitle>
                </CardHeader>
                <CardContent className="gap-">
        
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{selectedInvoice.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Id:</span>
                    <span>{selectedInvoice.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gateway:</span>
                    <span>{selectedInvoice.paymentGateway}</span>
                  </div>
                   <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${selectedInvoice.amount}</span>
                  </div>
                </CardContent>
              </Card>

            </>
          )}
        </DetailModal>
      </div>
    </>
  );
};

export default Payments;


