"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { RootState } from "@/types/common.types"
import { useSelector } from "react-redux"
import { fetchAgencyMenuApi, fetchAllClientsApi } from "@/services/agency/get.services"
import { useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user);


  const selectedUser = localStorage.getItem('selectedClient') as string

  const { data: menu, isLoading } = useQuery({
    queryKey: ["get-agency-menu", user.role, user.user_id], 
    queryFn: () => {
      return fetchAgencyMenuApi(user.role, user.role === "agency" ? user.planId : selectedUser);
    },
    enabled: !!user.role && ((user.role === "agency" && !!user.planId) || (user.role !== "agency" && !!user.user_id)),
    select: (data) => data?.data.menu || {},
    retry: true,
  });



  
    const { data: clients = [], isLoading: isClientsLoading } = useQuery({
      queryKey: ["get-nav-clients"],
      queryFn: () => {
        return fetchAllClientsApi()
      },
      select: (data) => data?.data.clients,
      staleTime: 1000 * 60 * 60,
    })







  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
          {isClientsLoading ? (
       <Skeleton height={50} count={1} />
      ): <TeamSwitcher clients={clients} />}
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
         <div className="mt-9" >
        <Skeleton height={30} count={6} />
      </div>
      ): <NavMain items={menu} />}
      </SidebarContent>
      <SidebarFooter>
         {isLoading ? (
       <Skeleton height={50} count={1} />
      ): <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
