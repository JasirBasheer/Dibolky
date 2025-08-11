import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
import { getActivitesApi } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ["get:AllActivites", user.role, user.user_id],
    queryFn: () => {
      return getActivitesApi(user.role, user.user_id);
    },
    select: (data) => data?.data?.result,
    enabled: !!user.user_id,
  });

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
      href: "/agency/calendar",
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
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Dashboard", "/client"],
          ["Overview", ""],
        ]}
      />
      <div className="w-full  lg:p-9 p-4  mb-16">
        <div className="w-full ">
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
