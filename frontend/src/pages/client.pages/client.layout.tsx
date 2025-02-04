import ClientNavBar from '@/components/client.components/navbar'
import SideBar from '@/components/client.components/sidebar.components/sidebar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className='h-screen overflow-y-hidden'>
      <ClientNavBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="relative h-full flex lg:flex-row flex-col lg:justify-end ">
        <SideBar isOpen={isOpen} />
        <div className="w-full bg-slate-100 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ClientLayout