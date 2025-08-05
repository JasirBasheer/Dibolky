"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { RootState } from "@/types/common"
import { useDispatch, useSelector } from "react-redux"
import { fetchAgencyMenuApi, fetchAllClientsApi } from "@/services/agency/get.services"
import { useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"
import CreateContentModal from "@/pages/contents/components/create-content.modal"
import { openCreateContentModal } from "@/redux/slices/ui.slice"
import { getSignedUrlApi } from "@/services"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user);
  const ui = useSelector((state: RootState) => state.ui);
  const [clientsWithProfile, setClientsWithProfile] = React.useState([])
  const dispatch = useDispatch()


    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if(e.key == "c" &&  (e.metaKey || e.ctrlKey)){
          e.preventDefault()
          dispatch(openCreateContentModal())
        }
        
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])


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
      select: (data) => data?.data.result.clients,
      staleTime: 1000 * 60 * 60,
    })

    React.useEffect(() => {
  const fetchClientProfiles = async () => {
    try {
      const updatedClients = await Promise.all(
        clients.map(async (client) => {
          if (client.profile && !client.profile.startsWith("http")) {
            if(client.profile == "")return client 
            const signedUrlRes = await getSignedUrlApi(client.profile)
            return {
              ...client,
              profile: signedUrlRes?.data?.signedUrl || "",
            }
          }
          return client
        })
      )
      setClientsWithProfile(updatedClients)
    } catch (err) {
      console.error("Error fetching client profiles", err)
    }
  }

  fetchClientProfiles()
}, [clients])



  return (
    <Sidebar collapsible="icon" {...props}>
      {ui.createContentModalOpen && <CreateContentModal/> }
      <SidebarHeader>
          {isClientsLoading ? (
       <Skeleton height={50} count={1} />
      ): <TeamSwitcher clients={clientsWithProfile} />}
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
