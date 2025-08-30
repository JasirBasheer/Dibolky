import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Search,
  ArrowUpDown,
  CreditCard,
  UserRound,
  ScanLine,
} from "lucide-react";
import { format } from "date-fns";
import { useFilter, usePagination } from "@/hooks";
import type { RootState } from "@/types";
import PaginationControls from "@/components/ui/PaginationControls";
import DetailModal from "@/components/modals/details-modal";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import Skeleton from "react-loading-skeleton";
import { Transactions } from "@/types/admin.types";
import { getAllTransactions } from "@/services/admin/get.services";

const TransactionsPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);

  const [filter, setFilter] = useState({
    query: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const { data, isLoading } = useQuery({
    queryKey: ["admin:get-transactions", page, debouncedFilter],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
      }).toString();
      return getAllTransactions(`?${searchParams}`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
  });
  useEffect(() => {
    reset();
  }, [debouncedFilter]);

  const openPlanDetails = (transaction: Transactions) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Admin", `/admin`],
          ["All Transactions", ""],
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
                    placeholder="Search by plan name, feature name, or price..."
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
                  { label: "Email", value: "email" },
                  { label: "Amount", value: "amount" },
                  { label: "Payment Gateway", value: "paymentGateway" },
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
              <span>All Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoading ? (
              <DataTable
                data={data?.data || []}
                onRowClick={openPlanDetails}
                columns={[
                  {
                    header: "Transaction id",
                    render: (transaction) => (
                      <div className="flex items-center gap-2">
                        <ScanLine className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{transaction.id}</div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: "Email",
                    render: (transaction) => (
                      <div className="flex items-center gap-1">
                        <UserRound className="h-4 w-4" />
                        <span className="">{transaction?.email}</span>
                      </div>
                    ),
                  },

                  {
                    header: "Through",
                    render: (transaction) => (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span className="">
                          {transaction.paymentGateway}
                        </span>
                      </div>
                    ),
                  },

                  {
                    header: "Amount",
                    render: (transaction) => (
                      <div className="flex items-center gap-1">
                        <span className="">
                         $ {transaction.amount}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: "CreatedAt",
                    render: (transaction) => (
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span className="">
                          {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
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
          title="Plan Details"
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        >
          {selectedTransaction && (
            <>
              <div className="flex  justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold font-lazare">
                    {selectedTransaction.id}
                  </h3>
                  <p className="text-sm text-gray-500 font-lazare font-semibold">
                    created At:{" "}
                    {format(new Date(selectedTransaction.createdAt), "MMM dd, yyyy")}
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
                    <span className="font-lazare font-semibold">Email:</span>
                    <span className="font-lazare font-bold">
                      {selectedTransaction.email}
                    </span>
                  </div>
                  <div className="flex justify-between font-lazare">
                    <span className="font-lazare font-semibold">
                      Description:
                    </span>
                    <span className="font-lazare font-bold">
                      {selectedTransaction.description}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">Amount:</span>
                    <span className="font-lazare font-bold">
                      $ {selectedTransaction.amount}
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

export default TransactionsPage;
