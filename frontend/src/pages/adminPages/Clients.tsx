import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'

const AdminClients = () => {
  const [clients, setClients] = useState<any>({Agency:[],Company:[]})
  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/admin/recent-clients')
      console.log(response)

      if (response && response.data.success) setClients(response.data.clients)
    } catch (error: any) {
      message.error(error.response && error.response.message)
    }
  }
  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className='w-full p-9'>
      <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>All Clients</h1>
        <div className="w-full flex lg:justify-start  justify-center mt-6 gap-3">
          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
           <div className="flex justify-between">
            <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Agency Owners</h1>
           </div>

            <div className="w-full">
            {clients.Agency.map((item:any, index:number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm">{item.name || ""}</div>
                )
              })}      
              </div>
          </div>

          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
            <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Company Owners</h1>
            <div className="w-full    gap-5  ">
            {clients.Company.map((item:any, index:number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm">{item.name || ""}</div>
                )
              })}     

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminClients