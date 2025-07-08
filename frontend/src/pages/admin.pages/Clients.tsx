import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import AdminClientDetails from './ClientsDetails'
import { IAdminClientData } from '@/types/admin.types'

const AdminClients = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clients, setClients] = useState({ Agency: [], Company: [] })
  const [client, setClient] = useState<IAdminClientData>()

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/admin/recent-clients')
      console.log(response)
      if (response && response.status == 200) setClients(response.data.clients)
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const errResponse = error as { response: { data?: { error?: string } } };
        message.error(errResponse.response.data?.error || 'An unknown error occurred');
      } else {
        message.error('An unknown error occurred');
      }
    }


  }
  useEffect(() => {
    fetchClients()
  }, [])

  const viewClient = async (client_id: string) => {
    try {
      setIsClicked(prev => !prev)
      setIsLoading(true);
      const client = await axios.get(`api/admin/get-client/${client_id}`)
      if (client) setClient(client.data.details)
        
    } catch (error: unknown) {
      message.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "An unknown error occurred"
      );
    }finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='relative w-full p-9'>
      <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>All Clients</h1>
        <div className="w-full flex lg:justify-start  justify-center mt-6 gap-3">
          {isClicked && !isLoading && client && (
            <AdminClientDetails client={client} setIsClicked={setIsClicked} />
          )}
          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
            <div className="flex justify-between">
              <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Agency Owners</h1>
            </div>

            <div className="w-full">
              {clients.Agency.map((item: { _id: string; name: string }, index: number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm"
                    onClick={() => viewClient(item._id)}
                  >{item.name || ""}</div>
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