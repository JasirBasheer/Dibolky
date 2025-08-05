"use client"

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { authLogoutApi } from "@/services/auth/post.services"
import { useNavigate } from "react-router-dom"
import { message } from 'antd';
import socket from "@/sockets";
import { SOCKET_EVENTS } from "@/constants"
import { useSelector } from "react-redux"
import { RootState } from "@/types"


export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    profile: string,
    role:string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const userData = useSelector((state:RootState)=> state.user)
  const agency = useSelector((state:RootState)=> state.agency)

  const handleLogout = async () => {
      try {
        const response = await authLogoutApi()
        socket.emit(SOCKET_EVENTS.USER.SET_OFFLINE,{ orgId: userData.orgId, userId: userData.role == "client" ? userData.user_id: agency.user_id})
        if (response) navigate('/login')
      } catch (error: unknown) {
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error("An unexpected error occurred");
        }
      }
    }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg overflow-hidden">
                <AvatarImage src={user.profile || "/placeholder.svg"} alt={user.name}  className="object-cover"/>
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg overflow-hidden">
                  <AvatarImage src={user.profile || "/placeholder.svg"} alt={user.name}
                  className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          {user.role == "agency" && 
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={()=> navigate('/agency/billing/upgrade')}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
          }
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={()=> navigate('/agency/settings')}> 
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              {user.role == "agency" && 
              <DropdownMenuItem onClick={()=> navigate('/agency/billing/history')}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              }
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
