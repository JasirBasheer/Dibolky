import { AppSidebar } from "@/components/agency.components/sidebar/app-sidebar"
import { CommandDialogMenu } from "@/components/ui/command-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <>
      <CommandDialogMenu />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 ">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
