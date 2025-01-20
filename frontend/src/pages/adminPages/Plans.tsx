import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import { ListFilterPlus, TrafficCone, Trash2 } from 'lucide-react'

const Plans = () => {
  const [plans,setPlans] = useState<any>({ Agency: [] , Company:[] })


  const fetchPlans = async() =>{
    try {
      const response = await axios.get('/api/entities/get-all-plans');
      setPlans(response.data.plans)     
     
    } catch (error:any) {
      message.error(error.response.data.error || "")
    }
  }
  useEffect(()=>{
    fetchPlans()
  },[])

  return (
    <div className='w-full p-9'>
      <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>Plans</h1>
        <div className="w-full flex lg:justify-start  justify-center mt-6 gap-3">
          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
           <div className="flex justify-between">
            <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Agency Plans</h1>
            <ListFilterPlus className='cursor-pointer' />
           </div>

            <div className="w-full">
            {plans.Agency.map((item:any, index:number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex justify-between mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm">
                    <p>{item.title || ""}</p>
                <TrafficCone className='w-4'/>     
                  </div>
                )
              })}     
              </div>
          </div>

          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
            <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Company Plans</h1>
            <div className="w-full border-gray-200  gap-5  ">
            {plans.Company.map((item:any, index:number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm">{item.title || ""}</div>
                )
              })}     

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Plans