import React, { useState } from 'react'
import SideBar from '../../components/admin/sidebar.components/sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/admin/Navbar'


export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className='h-screen overflow-y-hidden'>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className="relative h-full flex lg:flex-row flex-col lg:justify-end ">
        <SideBar isOpen={isOpen} />
        <div className="w-full bg-slate-100 overflow-y-auto h-full">
      <Outlet/>
  </div>
      </div>
    </div>
  )
}





