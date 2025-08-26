import { FileText, Receipt, Users } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IClient } from "@/types/client.types";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import DashboardCard from "./components/dashBoardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAllClientsApi,
  getAllTransactions,
} from "@/services/admin/get.services";
import { useQuery } from "@tanstack/react-query";
import { Transactions } from "@/types/admin.types";

const AdminDashboard = () => {
  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ["admin:get-recent-clients"],
    queryFn: () => {
      return fetchAllClientsApi(`?page=1&limit=10&sortOrder=desc`);
    },

    select: (data) => data?.data.clients,
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["admin:get-recent-transactions"],
    queryFn: () => {
      return getAllTransactions(`?page=1&limit=10&sortOrder=desc`);
    },
    select: (data) => data?.data,
  });

  console.log(transactions,"transactions")

  const navigate = useNavigate();

  const quickActions = [
    {
      title: "List Clients",
      href: "/admin/clients",
      icon: Users,
      description: "List all clients",
    },
    {
      title: "List Plans",
      href: "/admin/plans",
      icon: FileText,
      description: "List all plans",
    },
    {
      title: "List Transactions",
      href: "/admin/transactions",
      icon: Receipt,
      description: "List all transactions",
    },
  ];

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Admin", `/admin`],
          ["Dashboard Overview", ""],
        ]}
      />
      <div className="w-full  lg:p-9 p-4  mb-16">
        <div className="w-full ">
          <h1 className="text-2xl cantarell font-semibold">
            Dashbord Overview
          </h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5 mx-auto">
            <DashboardCard
              title="Total Clients"
              count={clients?.length ?? 0}
              lastWeekCount={3}
              isLoading={false}
            />
            <DashboardCard
              title="Total Plans"
              count={5}
              lastWeekCount={5}
              isLoading={false}
            />
            <DashboardCard
              title="Total Transactions"
              count={2}
              lastWeekCount={9}
              isLoading={false}
            />
            <DashboardCard
              title="Total Transactions"
              count={2}
              lastWeekCount={9}
              isLoading={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6  mx-auto">
            <Card className="w-full min-h-[11rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-md font-semibold text-gray-900">
                  Recent Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  {isClientsLoading ? (
                    <Skeleton className="mt-2" count={3} height={31} />
                  ) : clients.length > 0 ? (
                    clients.map((item: IClient, index: number) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate("/admin/clients");
                        }}
                        className="w-full border-1 border border-gray-100 px-5 rounded-md cursor-pointer min-h-12 flex items-center text-sm"
                      >
                        {item.name || ""}
                      </div>
                    ))
                  ) : (
                    <p>no clients found</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="w-full min-h-[11rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-md font-semibold text-gray-900">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  {isTransactionsLoading ? (
                    <Skeleton className="mt-2" count={3} height={31} />
                  ) : transactions.data.length > 0 ? (
                    transactions.data.map((item: Transactions, index: number) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate("/admin/transactions");
                        }}
                        className="w-full  border-1 border border-gray-100 px-5 rounded-md cursor-pointer min-h-12 flex items-center justify-between text-sm"
                      >
                        <p>{item.email || ""}</p>
                        <p>$ {item.amount || 0}</p>
                      </div>
                    ))
                  ) : (
                    <p>no transactions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="w-full min-h-[11rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-md font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.title}
                        to={action.href || "#"}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex flex-col items-center space-y-2 text-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors group-hover:bg-blue-50">
                            <Icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-medium text-gray-900 group-hover:text-blue-900">
                              {action.title}
                            </h3>
                            <p className="mt-1 text-[9px] text-gray-500 group-hover:text-gray-600">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="w-full flex items-center justify-center"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
