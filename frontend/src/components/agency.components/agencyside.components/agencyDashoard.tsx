import React, { Suspense, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchClientsCountApi, fetchInitialSetUpApi, fetchProjectsCountApi } from '@/services/agency/get.services'
const InitialSetUp = React.lazy(() => import('@/components/common.components/initial-set-up'));
import DashboardCard from './dashBoardCard'
import Skeleton from 'react-loading-skeleton';



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




  return (
    <>
      {isInitialSetUpOpened && (
        <Suspense fallback={<Skeleton />}>
          <InitialSetUp onClose={handleCloseSetup} link={`/agency/settings?tab=social-integrations&`} tutorialUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" />
        </Suspense>
      )}


      <div className='w-full p-9 mb-16'>
        <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>Dashbord Overview</h1>

          <div className="flex flex-wrap items-center lg:justify-start justify-center w-full mt-5 gap-5 ">
            <DashboardCard title="Total Projects" count={project?.count} lastWeekCount={project?.lastWeekCount} isLoading={isProjectsLoading} />
            <DashboardCard title="Total Clients" count={client?.count} lastWeekCount={client?.lastWeekCount} isLoading={isClientsLoading} />
          </div>
          <div className="w-full flex lg:justify-start justify-center mt-6">
            <div className="w-[31rem] min-h-[11rem] rounded-xl  bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
              <h1 className='text-md cantarell font-cantarell font-semibold text-black'>Quick Actions</h1>
              <div className="w-full flex justify-center items-center lg:justify-start lg:items-start  flex-wrap gap-5 p-2 pt-3">
                <Link to={'/agency/create-client'}>
                  <div className="text-black bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center  cursor-pointer hover:shadow-sm rounded-sm font-cantarell text-sm">Create Client</div>
                </Link>
                <Link to={'/agency/create-client'}>
                  <div className="text-black bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center rounded-sm font-cantarell text-sm">Create Content</div>
                </Link>              <Link to={'/agency/create-client'}>
                  <div className="text-black bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center rounded-sm font-cantarell text-sm">Import Leads</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AgencyDashboard



