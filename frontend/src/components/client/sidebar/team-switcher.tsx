"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/types/common"
import { setUser } from "@/redux/slices/user.slice"
import { fetchAgencyOwnerDetailsApi, fetchClientApi } from "@/services/agency/get.services"
import { message } from 'antd';
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSignedUrlApi } from "@/services/common/post.services"
import { setAgency } from "@/redux/slices/agency.slice"


export function TeamSwitcher({
  clients,
}: {
  clients: {
    _id: string
    main_id:string
    name: string
    profile: string
    email: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()





  React.useEffect(() => {
    
    if (!agency?.user_id) return;

    const selectedClient = localStorage.getItem('selectedClient');
    if (selectedClient && selectedClient !== agency?.user_id) {
      dispatch(setUser({ user_id: selectedClient, role: "agency-client" }));
    } else {
      dispatch(setUser({ user_id: agency.user_id, role: "agency" }));
      localStorage.setItem('selectedClient', agency.user_id)
    }
  }, [dispatch, agency.user_id]);



  const fetchSelectedUser = async () => {
    try {
      const selectedClient = localStorage.getItem('selectedClient')
      let response;
      let role = 'agency-client'

      if (selectedClient === agency?.user_id) {
        response = await fetchAgencyOwnerDetailsApi()
        role = 'agency'
        if (!response.data) return null
      } else {
        response = await fetchClientApi(selectedClient as string)
        if (!response.data) return null
      }
      const details = response.data.details || {};
      let profile = ""
      if (details.profile && details.profile !== "") {
      const signedUrlRes = await getSignedUrlApi(details.profile as string);

      if (signedUrlRes.data && signedUrlRes.data.signedUrl) {
        profile = signedUrlRes.data.signedUrl
      }
    }      

      dispatch(setUser({
        name: details.name,
        email: details.email,
        orgId: details.orgId,
        planId: details.planId,
        organizationName: details.organizationName,
        profile: profile || "",
        bio: details.bio || "",
        role: role,
        main_id: details.main_id || "",
      }));
      if(role == "agency")dispatch(setAgency({logo:profile}))

    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred");
      }
    }
  }


  const handleSelect = (user_id: string) => {
    if (!user_id) return;

    localStorage.setItem('selectedClient', user_id);
    dispatch(setUser({
      user_id: user_id,
      role: user_id === agency?.user_id ? "agency" : "agency-client"
    }));
    navigate('/agency');
  };


  React.useEffect(() => {
    if (user?.user_id) {
      fetchSelectedUser();
    }
  }, [user?.user_id]);



  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Owner</DropdownMenuLabel>
            <DropdownMenuItem key={agency.user_id} onClick={() => handleSelect(agency.user_id)} className="gap-2 p-2">
               <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={agency.logo || "/placeholder.svg"} alt={agency.organizationName} />
                <AvatarFallback className="rounded-lg">
                  {agency.organizationName[0]}
                </AvatarFallback>
              </Avatar>
                <div className="flex flex-col">
                {agency.organizationName}
                </div>
                <DropdownMenuShortcut>⌘ 0</DropdownMenuShortcut>
              </DropdownMenuItem>
            <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground">Clients</DropdownMenuLabel>
            {clients.map((client, index) => (
              <DropdownMenuItem key={client._id} onClick={() => handleSelect(client._id)} className="gap-2 p-2">
             <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={client.profile || "/placeholder.svg"} alt={client.name} />
                <AvatarFallback className="rounded-lg">
          {client.name[0]}
                </AvatarFallback>
              </Avatar>
                <div className="flex flex-col">
                {client.name}
                </div>
                <DropdownMenuShortcut>⌘ {index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={()=> navigate('/agency/create-client')}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add Client</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
