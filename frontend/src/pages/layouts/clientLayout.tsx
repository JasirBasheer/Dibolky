import { AppSidebar } from "@/components/client/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export function ClientLayout() {
  return (
    <>
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
