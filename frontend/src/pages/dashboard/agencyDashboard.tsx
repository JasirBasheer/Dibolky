import React, { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  fetchAllClientsApi,
  fetchInitialSetUpApi,
  fetchProjectsCountApi,
} from "@/services/agency/get.services";
const InitialSetUp = React.lazy(
  () => import("@/components/common/initial-set-up")
);
import DashboardCard from "@/pages/dashboard/components/dashBoardCard";
import Skeleton from "react-loading-skeleton";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { Separator } from "@radix-ui/react-separator";
import { CalendarWithEvents } from "@/components/agency/agencyside.components/dashboard/calendar-with-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Crown,
  Download,
  FileText,
  Receipt,
  Users,
} from "lucide-react";
import ActivityFeed from "@/components/common/activity";
import { getActivitesApi, getAllTransactions, getInvoices } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isInitialSetUpOpened, setIsInitailSetUpOpen] =
    useState<boolean>(false);

  const { data: project, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["get-projects-count"],
    queryFn: () => {
      return fetchProjectsCountApi();
    },
    select: (data) => data?.data.projects,
    staleTime: 1000 * 60 * 60,
  });

  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ["getClientsCount"],
    queryFn: () => {
      return fetchAllClientsApi("?include=count");
    },
    select: (data) => data?.data.result.clients,
    staleTime: 1000 * 60 * 60,
  });

  const { data: initialSetUp } = useQuery({
    queryKey: ["get-initial-agency-set-up"],
    queryFn: () => {
      return fetchInitialSetUpApi();
    },
    select: (data) => data?.data.initialSetUp,
  });

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["getInvoicesCount"],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: "1",
        limit: "0",
      }).toString();
      return getInvoices(user.role, user.user_id, `?${searchParams}`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
  });

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ["getAllActivites", user.role, user.user_id],
    queryFn: () => {
      return getActivitesApi(user.role, user.user_id);
    },
    select: (data) => data?.data?.result,
    enabled: !!user.user_id,
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["getTransactions"],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: "1",
        limit: "0",
        type: "invoice_payment",
      }).toString();
      return getAllTransactions(user.role, user.user_id, `?${searchParams}`);
    },
    select: (data) => data?.data.transactions,
    enabled: !!user.user_id,
  });

  useEffect(() => {
    if (initialSetUp) {
      const isSkiped = localStorage.getItem("skipInitialSetUp");
      if (!isSkiped) {
        const shouldOpenSetup =
          initialSetUp && Object.values(initialSetUp).includes(false);
        setIsInitailSetUpOpen(shouldOpenSetup);
      }
    }
  }, [initialSetUp]);

  const handleCloseSetup = () => setIsInitailSetUpOpen(false);

  const quickActions = [
    {
      title: "Create Client",
      href: "/agency/clients/create",
      icon: Users,
      description: "Add new client to your agency",
    },
    {
      title: "Create Content",
      href: "/agency/clients/create",
      icon: FileText,
      description: "Generate new content pieces",
    },
    {
      title: "Import Leads",
      href: "/agency/leads",
      icon: Download,
      description: "Upload and manage leads",
    },
    {
      title: "Schedule Content",
      href: "/agency/contents",
      icon: Calendar,
      description: "Plan your content calendar",
    },
    {
      title: "Create Invoice",
      href: "/agency/invoices/create",
      icon: Receipt,
      description: "Generate client invoices",
    },
    {
      title: "Upgrade Plan",
      href: "/agency/billing/upgrade",
      icon: Crown,
      description: "Unlock premium features",
    },
  ];
  return (
    <>
      {isInitialSetUpOpened && (
        <Suspense fallback={<Skeleton />}>
          <InitialSetUp
            onClose={handleCloseSetup}
            link={`/agency/settings?tab=social-integrations&`}
            tutorialUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
          />
        </Suspense>
      )}
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Dashboard", "/agency"],
          ["Overview", ""],
        ]}
      />
      <div className="w-full  lg:p-9 p-4  mb-16">
        <div className="w-full ">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5 mx-auto">
            <DashboardCard
              title="Total Projects"
              count={project?.count}
              lastWeekCount={project?.lastWeekCount}
              isLoading={isProjectsLoading}
            />
            <DashboardCard
              title="Total Clients"
              count={clients?.count}
              lastWeekCount={clients?.lastWeekCount}
              isLoading={isClientsLoading}
            />
            <DashboardCard
              title="Total Invoices"
              count={invoices?.totalCount}
              lastWeekCount={invoices?.totalCount}
              isLoading={isInvoicesLoading}
            />
            <DashboardCard
              title="Total Revenue"
              count={`$ ${
                transactions?.reduce((acc, item) => (acc += item.amount), 0) ||
                0
              }`}
              lastWeekCount={clients?.lastWeekCount}
              isLoading={isTransactionsLoading}
            />
          </div>
          <div className="w-full flex lg:justify-start justify-center mt-6">
            <div className="w-full h-[20rem]  border rounded-xl  bg-white p-5 shadow-sm  transition-all duration-300 mt">
              <h1 className="text-md cantarell font-cantarell font-semibold text-black">
                Activity History
              </h1>
              <Separator
                orientation="horizontal"
                className="h-[1px] mt-2 w-full bg-gray-200"
              />
              <div className="w-full h-[16rem]">
                {!isActivitiesLoading && (
                  <ActivityFeed activities={activities} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6  mx-auto">
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

            <div className="w-full flex items-center justify-center">
              <CalendarWithEvents/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
