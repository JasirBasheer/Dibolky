import { AppSidebar } from "@/components/client/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RootState } from "@/types";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import VideoCall from "../chat/components/videoCall";

export function ClientLayout() {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!user.user_id && !!user.name;

  return (
    <>
      <SidebarProvider>
        {isAuthenticated && <VideoCall />}
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
