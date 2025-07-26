import { AppSidebar } from "@/components/agency/sidebar/app-sidebar"
import { CommandDialogMenu } from "@/components/ui/command-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export function AgencyLayout() {
  return (
    <>
      <CommandDialogMenu />
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
