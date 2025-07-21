"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Home,
  MessageSquare,
  Users,
  FolderOpen,
  FileText,
  CreditCard,
  LineChart,
  Briefcase,
} from "lucide-react"



const icons:Record<string, LucideIcon>  = {
  AudioWaveform: AudioWaveform,
  Command: Command,
  Frame: Frame,
  GalleryVerticalEnd: GalleryVerticalEnd,
  Map: Map,
  PieChart: PieChart,
  Settings2: Settings2,
  Home: Home,
  Users: Users,
  MessageSquare: MessageSquare,
  FolderOpen: FolderOpen,
  FileText: FileText,
  CreditCard: CreditCard,
  LineChart: LineChart,
  Briefcase: Briefcase,
};


export function NavMain({
  items,
}: {
  items: {
    title: string
    icon?: string
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()
  const getIcon = (iconName: string) => {
    return icons[iconName as keyof typeof icons] || icons.LayoutDashboard;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={item.items?.some((sub) => location.pathname === `/agency${sub.url}`)}>
                {item.icon && (() => {
                  const Icon = getIcon(item.icon);
                  return <Icon className="h-4 w-4" />;
                })()}

                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={location.pathname === `/agency${subItem.url}`}>
                        <Link to={`/agency${subItem.url}`}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
