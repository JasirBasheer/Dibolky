"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { RootState } from "@/types/common"
import { useSelector } from "react-redux"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user);

   
   const menu: { title: string; icon?: string; url?: string }[] = [
          {
       title: 'Dashboard',
       icon: 'LayoutDashboard',
       url: '/admin/'
     },
      {
       title: 'All Clients',
       icon: 'Users',
       url: '/admin/clients'
     },
     {
       title: 'All Plans',
       icon: 'GalleryVertical',
       url: '/admin/plans'
     },
      {
       title: 'All Transactions',
       icon: 'BadgeDollarSign',
       url: '/admin/transactions'
     },
    //   {
    //    title: 'Settings',
    //    icon: 'Settings',
    //    url: '/admin/settings'
    //  }
    ]
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
         <NavMain items={menu} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
