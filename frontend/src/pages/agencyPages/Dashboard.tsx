import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const AgencyDashboard = () => {
  return (
    <div className='w-full p-9'>
      <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>Dashbord Overview</h1>
        <div className="flex flex-wrap items-center lg:justify-start justify-center w-full mt-5 gap-5 ">
          {[1, 2, 3, 4].map((_,index) => (
            <div key={index} className="w-[17.9rem] min-h-[10rem] rounded-xl  bg-white p-5 pt-7 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Active Projects</p>
              <ArrowUpRight  className='w-4 text-green-600'/>
            </div>
            <p className='text-2xl my-2 font-cantarell font-semibold'>24</p>
            <p className='font-cantarell text-gray-400'>+2 this week</p>
            </div>
          ))}
        </div>
        <div className="w-full flex lg:justify-start justify-center mt-6">
        <div className="w-[31rem] min-h-[11rem] rounded-xl  bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
        <h1 className='text-md cantarell font-cantarell font-semibold'>Quick Actions</h1>
        <div className="w-full flex justify-center items-center lg:justify-start lg:items-start  flex-wrap gap-5 p-2 pt-3">
          <Link to={'/agency/create-client'}>
          <div className="bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center  cursor-pointer hover:shadow-sm rounded-sm font-cantarell text-sm">Create Client</div>
          </Link>
          <div className="bg-slate-100 min-w-[13rem] min-h-[2.9rem] flex items-center justify-center rounded-sm font-cantarell text-sm">Create Client</div>
        </div>

        </div>

        </div>
      </div>
    </div>
  )
}

export default AgencyDashboard

