import { AppSidebar } from "@/components/agency/sidebar/app-sidebar"
import { CommandDialogMenu } from "@/components/ui/command-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RootState } from "@/types";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom"
import VideoCall from "../chat/components/videoCall";

export function AgencyLayout() {
  const user = useSelector((state:RootState) => state.user);
  const isAuthenticated = !!user.user_id && !!user.name;

  return (
    <>
      <CommandDialogMenu />
      {isAuthenticated && <VideoCall />}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
