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
       icon: 'Users',
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
     }
    ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
       <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
         <NavMain items={menu} />
      </SidebarContent>
      <SidebarFooter>
      <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
