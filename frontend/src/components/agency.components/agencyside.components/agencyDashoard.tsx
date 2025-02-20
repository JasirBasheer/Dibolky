import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import { fetchClientsCountApi, fetchProjectsCountApi } from '@/services/agency/get.services'



const AgencyDashboard: React.FC = () => {


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




  return (
    <div className='w-full p-9 mb-16'>
      <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>Dashboard Overview</h1>
        <div className="flex flex-wrap items-center lg:justify-start justify-center w-full mt-5 gap-5 ">
          <div className="lg: lg:w-[17.9rem] w-[20rem] min-h-[5rem] rounded-xl  bg-white p-5 pt-4 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Total Projects</p>
              <ArrowUpRight className='w-4 text-green-600' />
            </div>
            <p className='text-2xl my-1 font-cantarell font-semibold'>{isProjectsLoading ? (<Skeleton className="h-7 w-48" />) : project.count}</p>
            <p className='font-cantarell text-gray-400'>{isProjectsLoading ? (<Skeleton className="h-7 w-48" />) : (`+${project.lastWeekCount} this week`)}</p>
          </div>

          <div className=" lg:w-[17.9rem] w-[20rem] min-h-[5rem] rounded-xl  bg-white p-5 pt-4 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Total Clients</p>
              <ArrowUpRight className='w-4 text-green-600' />
            </div>
            <p className='text-2xl my-1 font-cantarell font-semibold'>{isClientsLoading ? (<Skeleton className="h-7 w-48" />) : client.count}</p>
            <p className='font-cantarell text-gray-400'>{isClientsLoading ? (<Skeleton className="h-7 w-48" />) : (`+${client.lastWeekCount} this week`)}</p>
          </div>

          <div className=" lg:w-[17.9rem] w-[20rem] min-h-[5rem] rounded-xl  bg-white p-5 pt-4 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Total Clients</p>
              <ArrowUpRight className='w-4 text-green-600' />
            </div>
            <p className='text-2xl my-1 font-cantarell font-semibold'>{isClientsLoading ? (<Skeleton className="h-7 w-48" />) : client.count}</p>
            <p className='font-cantarell text-gray-400'>{isClientsLoading ? (<Skeleton className="h-7 w-48" />) : (`+${client.lastWeekCount} this week`)}</p>
          </div>

        </div>
        <div className="w-full flex lg:justify-start justify-center mt-6">
          <div className="w-[31rem] min-h-[11rem] rounded-xl  bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
            <h1 className='text-md cantarell font-cantarell font-semibold'>Quick Actions</h1>
            <div className="w-full flex justify-center items-center lg:justify-start lg:items-start  flex-wrap gap-5 p-2 pt-3">
              <Link to={'/agency/create-client'}>
                <div className="bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center  cursor-pointer hover:shadow-sm rounded-sm font-cantarell text-sm">Create Client</div>
              </Link>
              <Link to={'/agency/create-client'}>
                <div className="bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center rounded-sm font-cantarell text-sm">Create Content</div>
              </Link>              <Link to={'/agency/create-client'}>
                <div className="bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center rounded-sm font-cantarell text-sm">Import Leads</div>
              </Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default AgencyDashboard



