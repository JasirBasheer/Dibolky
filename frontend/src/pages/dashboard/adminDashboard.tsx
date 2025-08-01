import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import { message } from 'antd'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { IClient } from '@/types/client.types'
import CustomBreadCrumbs from '@/components/ui/custom-breadcrumbs'


const AdminDashboard = () => {
  const [recentClients, setRecentClients] = useState<IClient[]>([])
  const fetchRecentClients = async () => {
    try {
      const response = await axios.get('/api/admin/recent-clients')
      console.log(response)

      if (response && response.status == 200) {
        setRecentClients([...response.data.clients])
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || "");
    }
    
  }
  useEffect(() => {
    fetchRecentClients()
  }, [])

  const totalRevenue = recentClients.reduce((acc: number, item: IClient) => {
    return acc + item.planPurchasedRate
  }, 0)
  return (
    <div className='w-full p-9'>
        <CustomBreadCrumbs
        breadCrumbs={[
          ["Influencers", "/influencers"],
          ["Search", ""],
        ]}
      />
      <div className="w-full ">
        <h1 className='text-2xl cantarell font-semibold'>Dashbord Overview</h1>
        <div className="flex flex-wrap items-center lg:justify-start justify-center w-full mt-5 gap-5 ">
          <div className="w-[17.9rem] min-h-[10rem] rounded-xl  bg-white p-5 pt-7 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Total Revenue</p>
              <ArrowUpRight className='w-4 text-green-600' />
            </div>
            <p className='text-2xl my-2 font-cantarell font-semibold'>$ {totalRevenue}</p>
            <p className='font-cantarell text-gray-400'>+2 this week</p>
          </div>

          <div className="w-[17.9rem] min-h-[10rem] rounded-xl  bg-white p-5 pt-7 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Total Number Owners</p>
              <ArrowUpRight className='w-4 text-green-600' />
            </div>
            <p className='text-2xl my-2 font-cantarell font-semibold'>{recentClients.length}</p>
            <p className='font-cantarell text-gray-400'>+1 this week</p>
          </div>

          <div className="w-[17.9rem] min-h-[10rem] rounded-xl  bg-white p-5 pt-7 hover:shadow-md cursor-pointer transition-all duration-300">
            <div className="flex justify-between">
              <p className='font-cantarell text-gray-400'>Today's Revenue</p>
              <ArrowUpRight className='w-4 text-green-600' />
            </div>
            <p className='text-2xl my-2 font-cantarell font-semibold'>0</p>
            <p className='font-cantarell text-gray-400'>+1 this week</p>
          </div>

        </div>
        <div className="w-full flex lg:justify-start  justify-center mt-6">
          <div className="w-[37rem] min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5 hover:shadow-md  transition-all duration-300 mt">
            <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Recent Clients</h1>
            <div className="w-full  border-t-2 border-gray-200  gap-5  ">
              {recentClients.length>0
                ? recentClients.map((item: IClient, index: number) => (
                  <div
                    key={index}
                    className="w-full min-h-12 flex items-center text-sm"
                  >
                    {item.name || ""}
                  </div>
                ))
                : <Skeleton className='mt-2' width={300} height={31} />}
            </div>
          </div>

        </div>
      </div>
    </div>)
}

export default AdminDashboard