import { setUser } from '@/redux/slices/userSlice';
import axios from '@/utils/axios';
import { AlignLeft, Bell, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


type ClientNavBarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};



const ClientNavBar: React.FC<ClientNavBarProps> = ({ isOpen, setIsOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpened, setIsNotificationOpened] = useState<boolean>(false)



  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/employee/get-employee-details")
      return response.data.client;
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }




  return (
    <div className='relative grid grid-cols-12 min-h-[4.5rem]'>
      <div className="col-span-2 bg-white flex items-center justify-start pl-9 text-blue-600 text-2xl font-bold">Dibolky</div>
      <div className="lg:col-span-7 col-span-7"></div>
      <div className="lg:col-span-3 flex items-center lg:pl-28 gap-7">
        <Bell className='ml-16 w-5 cursor-pointer'
          onClick={() => {
            setIsNotificationOpened(!isNotificationOpened)
            setIsProfileOpen(false)
          }
          }
        />
        <img
          className="relative cursor-pointer sm:block hidden w-9 h-9 shadow-md rounded-full"
          src="https://oliver-andersen.se/wp-content/uploads/2018/03/cropped-Profile-Picture-Round-Color.png"
          alt="Profile"
          onClick={() => {
            setIsProfileOpen(!isProfileOpen)
            setIsNotificationOpened(false)
          }}
        />
      </div>

      {isProfileOpen && (
        <AnimatePresence >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-28 top-[4.8rem] bg-white shadow-lg border rounded-md w-[20rem] max-h-[11rem] z-10 overflow-y-auto p-4 text-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://oliver-andersen.se/wp-content/uploads/2018/03/cropped-Profile-Picture-Round-Color.png"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              {/* <div>
                <p className="font-semibold">{client?.name}</p>
                <p className="text-xs text-gray-500">{client?.email}</p>
              </div> */}
            </div>

            <div className="border-t pt-3">
              <p className="font-medium mb-2">Connect Platforms</p>
             
            </div>
          </motion.div>
        </AnimatePresence>

      )}



      {isNotificationOpened && (
        <AnimatePresence >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-28 top-[4.8rem] bg-white shadow-lg border rounded-md w-[20rem] min-h-[11rem] z-10 overflow-y-auto p-4 text-sm"
          >

          </motion.div>
        </AnimatePresence>
      )}

      <div className="lg:hidden col-span-2 flex items-center">
        {isOpen ? (<X onClick={() => setIsOpen(prev => !prev)} />) : (<AlignLeft onClick={() => setIsOpen(prev => !prev)} />)}
      </div>
    </div>
  )
}

export default ClientNavBar