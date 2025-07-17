import React, { Suspense, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchClientsCountApi, fetchInitialSetUpApi, fetchProjectsCountApi } from '@/services/agency/get.services'
const InitialSetUp = React.lazy(() => import('@/components/common.components/initial-set-up'));
import DashboardCard from './dashBoardCard'
import Skeleton from 'react-loading-skeleton';
import CustomBreadCrumbs from '@/components/ui/custom-breadcrumbs';
import { Separator } from '@radix-ui/react-separator';
import { CalendarWithEvents } from './dashboard/calendar-with-events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Crown, Download, FileText, Receipt, Users } from 'lucide-react';
import ActivityFeed from '@/components/common.components/activity';



const AgencyDashboard: React.FC = () => {
  const [isInitialSetUpOpened, setIsInitailSetUpOpen] = useState<boolean>(false)

  const { data: project, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["get-projects-count"],
    queryFn: () => {
      return fetchProjectsCountApi()
    },
    select: (data) => data?.data.projects,
    staleTime: 1000 * 60 * 60,
  })


  const { data: client, isLoading: isClientsLoading } = useQuery({
    queryKey: ["get-clients-count"],
    queryFn: () => {
      return fetchClientsCountApi()
    },
    select: (data) => data?.data.clients,
    staleTime: 1000 * 60 * 60,
  })

  const { data: initialSetUp } = useQuery({
    queryKey: ["get-initial-agency-set-up"],
    queryFn: () => {
      return fetchInitialSetUpApi()
    },
    select: (data) => data?.data.initialSetUp,
  })

  useEffect(() => {
    if (initialSetUp) {
      const isSkiped = localStorage.getItem('skipInitialSetUp');
      if (!isSkiped) {
        const shouldOpenSetup = initialSetUp && Object.values(initialSetUp).includes(false);
        setIsInitailSetUpOpen(shouldOpenSetup);

      }
    }
  }, [initialSetUp]);

  const handleCloseSetup = () => setIsInitailSetUpOpen(false);


const quickActions = [
  {
    title: "Create Client",
    href: "/agency/create-client",
    icon: Users,
    description: "Add new client to your agency",
  },
  {
    title: "Create Content",
    href: "/agency/create-content",
    icon: FileText,
    description: "Generate new content pieces",
  },
  {
    title: "Import Leads",
    href: "/agency/import-leads",
    icon: Download,
    description: "Upload and manage leads",
  },
  {
    title: "Schedule Content",
    href: "/agency/schedule-content",
    icon: Calendar,
    description: "Plan your content calendar",
  },
  {
    title: "Create Invoice",
    href: "/agency/create-invoice",
    icon: Receipt,
    description: "Generate client invoices",
  },
  {
    title: "Upgrade Plan",
    href: "/agency/upgrade-plan",
    icon: Crown,
    description: "Unlock premium features",
  },
]




const sampleActivities= [
  {
    _id: "1",
    user: {
      userId: "u123",
      username: "jasir",
      email: "jasir@example.com",
    },
    activityType: "account_created",
    entity: {
      type: "agency",
      id: "new Types.ObjectId()",
    },
    activity: "Jasir created a new agency account.",
    redirectUrl: "/agency/overview",
    createdAt: "new Date().toISOString()",
  },
  {
    _id: "2",
    user: {
      userId: "u456",
      username: "amaya",
      email: "amaya@example.com",
    },
    activityType: "client_created",
    entity: {
      type: "client",
      id: "new Types.ObjectId()",
    },
    activity: "Amaya added a new client.",
    redirectUrl: "/clients/u456",
    createdAt: "new Date().toISOString()",
  },
  {
    _id: "3",
    user: {
      userId: "u789",
      username: "ravi",
      email: "ravi@example.com",
    },
    activityType: "plan_upgraded",
    entity: {
      type: "agency",
      id: "new Types.ObjectId()",
    },
    activity: "Ravi upgraded the agency’s subscription plan.",
    redirectUrl: "/billing",
    createdAt: "new Date().toISOString()",
  },
  {
    _id: "4",
    user: {
      userId: "u101",
      username: "nisha",
      email: "nisha@example.com",
    },
    activityType: "content_approved",
    entity: {
      type: "client",
      id: "new Types.ObjectId()",
    },
    activity: "Nisha approved a content piece for Client X.",
    redirectUrl: "/content/approved",
    createdAt: "new Date().toISOString()",
  },
  {
    _id: "5",
    user: {
      userId: "u102",
      username: "arjun",
      email: "arjun@example.com",
    },
    activityType: "content_rejected",
    entity: {
      type: "client",
      id: "new Types.ObjectId()",
    },
    activity: "Arjun rejected the content for revision.",
    redirectUrl: "/content/rejected",
    createdAt: "new Date().toISOString()",
  },
];



  return (
    <>
      {isInitialSetUpOpened && (
        <Suspense fallback={<Skeleton />}>
          <InitialSetUp onClose={handleCloseSetup} link={`/agency/settings?tab=social-integrations&`} tutorialUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" />
        </Suspense>
      )}
    <CustomBreadCrumbs
        breadCrumbs={[
          ["Dashboard", "/agency"],
          ["Overview", ""],
        ]}
      />
      <div className='w-full  lg:p-9 p-4  mb-16'>
        <div className="w-full ">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5 mx-auto">
            <DashboardCard title="Total Projects" count={project?.count} lastWeekCount={project?.lastWeekCount} isLoading={isProjectsLoading} />
            <DashboardCard title="Total Clients" count={client?.count} lastWeekCount={client?.lastWeekCount} isLoading={isClientsLoading} />
            <DashboardCard title="Total Clients" count={client?.count} lastWeekCount={client?.lastWeekCount} isLoading={isClientsLoading} />
            <DashboardCard title="Total Clients" count={client?.count} lastWeekCount={client?.lastWeekCount} isLoading={isClientsLoading} />
          </div>
          <div className="w-full flex lg:justify-start justify-center mt-6">
            <div className="w-full h-[20rem]  border rounded-xl  bg-white p-5 shadow-sm  transition-all duration-300 mt">
              <h1 className='text-md cantarell font-cantarell font-semibold text-black'>Activity History</h1>
                <Separator orientation="horizontal" className="h-[1px] mt-2 w-full bg-gray-200" />
                <div className='w-full h-[16rem]'>

             <ActivityFeed activities={sampleActivities}/>
                </div>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6  mx-auto">
  {/* Quick Actions Card */}
  <Card className="w-full min-h-[11rem]">
    <CardHeader className="pb-4">
      <CardTitle className="text-md font-semibold text-gray-900">Quick Actions</CardTitle>
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

  {/* Calendar Component */}
  <div className="w-full flex items-center justify-center">
    <CalendarWithEvents />
  </div>
</div>

        </div>
      </div>
    </>
  )
}

export default AgencyDashboard



