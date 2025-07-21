import React, { useState } from 'react'
import SideBar from '../../components/admin/sidebar.components/sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/admin/Navbar'


const AdminLayout = () => {
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

export default AdminLayout




//Professional
// Ideal for growing agencies with established clients
// Up to 5 clients
// Advanced analytics
// Social media scheduling
// Priority support
// Custom reporting
// API access
// Team collaboration


// 