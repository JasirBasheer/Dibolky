import { BadgeDollarSign, ChevronRight, GalleryVertical, LayoutDashboard, MessageSquareText, Settings, Users, type LucideIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



const icons:Record<string, LucideIcon>  = {
  Users:Users,
  GalleryVertical:GalleryVertical, 
  MessageSquareText:MessageSquareText,
  Settings:Settings,
  LayoutDashboard:LayoutDashboard,
  BadgeDollarSign:BadgeDollarSign,

};


export function NavMain({
  items,
}: {
  items: {
    title: string
    icon?: string
    url?: string
    isActive?: boolean
  }[]
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const getIcon = (iconName: string) => {
    return icons[iconName as keyof typeof icons] || icons.LayoutDashboard;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={location.pathname == `${item.url}`} onClick={()=> navigate(item.url)}>
                {item.icon && (() => {
                  const Icon = getIcon(item.icon);
                  return <Icon className="h-4 w-4" />;
                })()}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
