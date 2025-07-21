import { CalendarDemo } from '@/components/client/dashboard.components/calender'
import { OneLineGraph } from '@/components/client/dashboard.components/dashbord.graph'
import { Calendar } from '@/components/ui/calendar'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'

const ClientDashboard = () => {
  return (
    <>
    <div className='flex min-h-screen flex-col gap-4 p-4 md:p-8'>
      <div className="">
        <h1 className='text-[1.3rem] font-bold'>Dashboard Overview</h1>
      </div>
      <div className=" flex  flex-wrap items-center sm:justify-start justify-center gap-4 ">
          {[1, 2,3, 4 ].map((_,index) => (
            <div key={index} className="md:w-[17.9rem] min-h-[7rem] rounded-xl outline-1 outline-double outline-[#45444424] bg-white p-5 pt-4 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Account Reach</p>
              <ArrowUpRight  className='w-4 text-green-600'/>
            </div>
            <p className='text-2xl my-2 font-cantarell font-semibold'>24</p>
            <p className='font-cantarell text-gray-400'>+2 this week</p>
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-4">
      <div  className="md:w-[46rem] w-[46rem]  min-h-[32rem] rounded-xl outline-1 outline-double outline-[#45444424] bg-white p-5 pt-4 cursor-pointer transition-all duration-300">
          <div className="">
            <h1 className='font-bold font-cantarell text-[1.2rem]'>Recent Activity</h1>
            <div className="w-full gap-5 mt-2">
              {[1,2,3,4].map(()=>{
                return (
                  <div className="w-full bg-slate-100 flex items-center h-14 mb-3">asdf</div>
                )
              })}
            </div>
          </div>
          <div className="">

          </div>
      </div>
          <div className="">
      <div className="sm:w-[28rem] w-[22rem] -z-1 mb-4">
      <OneLineGraph title={'Total Profile visitors'} description={'total engagement in this month'} data={[
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
      ]}/>
    </div>
    <div className="sm:w-[28rem] w-full flex items-center justify-center ">
    </div>
    
      </div>
      </div>
    
    </div>
      <div className="flex items-center justify-center  w-full h-[4rem] text-black">
      </div>
      </>
  )
}

export default ClientDashboard