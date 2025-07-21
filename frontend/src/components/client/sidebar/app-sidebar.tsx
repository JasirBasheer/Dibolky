"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar"
import { RootState } from "@/types/common"
import { useDispatch, useSelector } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"
import CreateContentModal from "@/components/common/create-content.modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from "lucide-react"
import { getClientDetailsApi } from "@/services/client/get.services"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user);
  const ui = useSelector((state: RootState) => state.ui);


  const { data: menu, isLoading } = useQuery({
    queryKey: ["get-client-menu", user.role, user.user_id], 
    queryFn: () => {
      return getClientDetailsApi();
    },
    select: (data) => data?.data.client.menu || {},
    retry: true,
  });

  console.log(menu,"clients menuuu")





  return (
    <Sidebar collapsible="icon" {...props}>
      {ui.createContentModalOpen && <CreateContentModal/> }
      <SidebarHeader>
        <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={user.profile || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="rounded-lg">
              {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
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
