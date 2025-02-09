import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import AdminClientDetails from './ClientsDetails'

const AdminClients = () => {
  const [clients, setClients] = useState<any>({ Agency: [], Company: [] })
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const [client, setClient] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false);
  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/admin/recent-clients')
      console.log(response)
      if (response && response.status == 200) setClients(response.data.clients)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.response.data.error || '')
    }
  }
  useEffect(() => {
    fetchClients()
  }, [])

  const viewClient = async (id: string, role: string) => {
    try {
      setIsClicked(prev => !prev)
      setIsLoading(true);
      const client = await axios.get(`api/admin/get-client/${role}/${id}`)

      if (client) {
        setClient(client.data.details)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.response.data.error || "")
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
              {clients.Agency.map((item: any, index: number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm"
                    onClick={() => viewClient(item._id, "Agency")}
                  >{item.name || ""}</div>
                )
              })}
            </div>
          </div>

          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
            <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Company Owners</h1>
            <div className="w-full    gap-5  ">
              {clients.Company.map((item: any, index: number) => {
                return (
                  <div key={index} className="w-full min-h-12 flex mb-2 px-4 bg-slate-50  transition-all duration-500 rounded-md hover:shadow-md cursor-pointer items-center text-sm"
                    onClick={() => viewClient(item._id, "Company")}
                  >{item.name || ""}

                  </div>
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