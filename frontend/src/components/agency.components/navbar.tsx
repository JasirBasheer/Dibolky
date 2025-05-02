import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { AlignLeft, Bell, Bolt, Moon, Sun, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { setUser } from '@/redux/slices/user.slice';
import { useQuery } from '@tanstack/react-query';
import { NavClient } from '@/types/agency.types';
import { useDispatch, useSelector } from 'react-redux';
import { authLogoutApi } from '@/services/auth/post.services';
import { fetchAllClientsApi, fetchAgencyOwnerDetailsApi, fetchClientApi } from '@/services/agency/get.services';
import {
  AppDispatch,
  NavbarProps,
  RootState
} from '@/types/common.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { Button } from '../ui/button';
import { useTheme } from '@/provider/theme.provider';
import CreateContent from '../common.components/create-content.modal';
import { openCreateContentModal } from '@/redux/slices/ui.slice';
import PlanExpiredModal from '../common.components/plan-expired.modal';




const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const { setTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);
  const ui = useSelector((state: RootState) => state.ui);
  const navigate = useNavigate()
  const [isSortCutOpen, setIsSortCutOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)




  useEffect(() => {
    if (!agency?.user_id) return;

    const selectedClient = localStorage.getItem('selectedClient');
    if (selectedClient && selectedClient !== agency?.user_id) {
      dispatch(setUser({ user_id: selectedClient, role: "agency-client" }));
    } else {
      dispatch(setUser({ user_id: agency.user_id, role: "agency" }));
      localStorage.setItem('selectedClient', agency.user_id)
    }
  }, [dispatch, agency.user_id]);

  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ["get-nav-clients"],
    queryFn: () => {
      return fetchAllClientsApi()
    },
    select: (data) => data?.data.clients,
    staleTime: 1000 * 60 * 60,
  })


  const handleLogout = async () => {
    try {
      const response = await authLogoutApi()
      if (response) navigate('/login')
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred");
      }
    }
  }


  const fetchSelectedUser = async () => {
    try {
      const selectedClient = localStorage.getItem('selectedClient')
      let response;
      let role = 'agency-client'
      console.log(user.user_id, agency.user_id)
      if (selectedClient === agency?.user_id) {
        response = await fetchAgencyOwnerDetailsApi()
        role = 'agency'
        if (!response.data) return null
      } else {
        response = await fetchClientApi(selectedClient as string)
        console.log(response.data, "userdata")
        if (!response.data) return null
      }
      const details = response.data.details || {};
      dispatch(setUser({
        name: details.name,
        email: details.email,
        orgId: details.orgId,
        planId: details.planId,
        organizationName: details.organizationName,
        facebookAccessToken: details?.socialMedia_credentials?.facebook?.accessToken || "",
        instagramAccessToken: details?.socialMedia_credentials?.instagram?.accessToken || "",
        profile: details.profile || "",
        bio: details.bio || "",
        role: role,
        main_id: details.main_id || "",
      }));
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

    setIsProfileOpen(false);
    localStorage.setItem('selectedClient', user_id);
    dispatch(setUser({
      user_id: user_id,
      role: user_id === agency?.user_id ? "agency" : "agency-client"
    }));
    navigate('/agency');
  };


  useEffect(() => {
    if (user?.user_id) {
      fetchSelectedUser();
    }
  }, [user?.user_id]);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSortCutOpen((open) => !open)
      }else if(e.key == "d" &&  (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        setIsSortCutOpen(false)
        navigate('/agency')
      }else if(e.key == "s" &&  (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        setIsSortCutOpen(false)
        navigate('/agency/settings')
      }else if(e.key == "p" &&  (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        setIsSortCutOpen(false)
        navigate('/agency/projects')
      }else if(e.key == "c" &&  (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        dispatch(openCreateContentModal())
        setIsSortCutOpen(false)
      }
      
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])



  return (
    <>
     <PlanExpiredModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPlan={{
          name: "Basic",
          price: 9.99,
          features: ["5 Projects", "10GB Storage", "Basic Support"],
        }}
        upgradePlans={[
          {
            name: "Pro",
            price: 19.99,
            features: ["15 Projects", "50GB Storage", "Priority Support", "API Access"],
            popular: true,
          },
          {
            name: "Enterprise",
            price: 49.99,
            features: ["Unlimited Projects", "500GB Storage", "24/7 Support", "API Access", "Custom Integrations"],
          },
        ]}
      />

    <div className='relative grid grid-cols-12 min-h-[4.5rem]'>

      <CommandDialog open={isSortCutOpen} onOpenChange={setIsSortCutOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => navigate('/agency') }>
              <div className="flex justify-between w-full">
                Dashboard
              <div className=" items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
              <span className="text-xs w-4 h-4">⌘</span>D
              </div> 
            </div>
            </CommandItem>
            <CommandItem onSelect={() => navigate('/agency/projects') }>
              <div className="flex justify-between w-full">
              Projects
              <div className=" items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
              <span className="text-xs w-4 h-4">⌘</span>p
              </div> 
            </div>
            </CommandItem>
            <CommandItem onSelect={() => navigate('/agency/settings') }>
              <div className="flex justify-between w-full">
              Settings
              <div className=" items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
              <span className="text-xs w-4 h-4">⌘</span>S
              </div> 
            </div>
            </CommandItem>
            <CommandItem onSelect={() => dispatch(openCreateContentModal()) }>
            <div className="flex justify-between w-full">
              Create Content
              <div className=" items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
              <span className="text-xs w-4 h-4">⌘</span>C
              </div> 
            </div>
            </CommandItem>
            <CommandItem onSelect={() => navigate('/agency/settings?tab=social-integrations&') }>
              <div className="flex justify-between w-full">
              Connections
          
            </div>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => setTheme("light")}>
              <Sun className="mr-1" style={{ height: "16px", width: "16px" }} />
              <span>Light</span>
            </CommandItem>

            <CommandItem onSelect={() => setTheme("dark")}>
              <Moon className="mr-1" style={{ height: "16px", width: "16px" }} />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => setTheme("system")}>
              <Bolt className="mr-1" style={{ height: "16px", width: "16px" }} />
              System
            </CommandItem>

          </CommandGroup>
        </CommandList>

      </CommandDialog>
      {ui.createContentModalOpen && <CreateContent/> }

      <div className="col-span-2 flex items-center justify-start pl-9 text-blue-600 dark:text-blue-300 font-cantarell text-2xl font-bold">Dibolky</div>
      <div className="lg:col-span-6 col-span-6"></div>
      <div className="lg:col-span-4 flex items-center lg:pl-12 gap-7">
        <div className="lg:flex hidden gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSortCutOpen(true)}
            className="relative flex items-center justify-center h-9 w-24 bg-slate-50 dark:bg-[#ffffff2e]"
          >
            <div className=" items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
              <span className="text-xs w-4 h-4">⌘</span>K
            </div>
          </Button>


          {isClientsLoading ? (
            <Skeleton width={100} height={30} />
          ) : (<Select
            onValueChange={handleSelect}
            value={user?.user_id}
          >
            <SelectTrigger className="w-full px-3 py-2 border rounded-md text-sm appearance-none focus:outline-none cursor-pointer shadow-sm ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={agency?.user_id} className="px-2 py-1 min-w-[11rem]">
                  Owner
                </SelectItem>
                {clients?.map((client: NavClient) => (
                  <SelectItem
                    key={client._id}
                    value={client._id}
                    className="px-2 py-1 min-w-[11rem]"
                  >
                    {client.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          )}
        </div>
        <Bell className='ml-16' />
        <div
          className="relative bg-black cursor-pointer w-[2rem] h-8 rounded-full"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
        </div>
      </div>

      {isProfileOpen && (
        <div className="absolute right-10 top-[4.8rem] bg-white shadow-lg border rounded-md w-[20rem] max-h-[11rem] z-10  overflow-y-auto  p-4 text-sm">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://oliver-andersen.se/wp-content/uploads/2018/03/cropped-Profile-Picture-Round-Color.png"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{user.name || ""}</p>
              <p className="text-xs text-gray-500">{user.email || ""}</p>
            </div>
          </div>

          <div className="bg-slate-200 w-[4rem] flex items-center justify-center rounded-sm h-7 mt-2 cursor-pointer" onClick={handleLogout}>Logout</div>
        </div>
      )}

      <div className="lg:hidden col-span-2 flex items-center">
        {isOpen}
        {isOpen ? (<X onClick={() => setIsOpen(prev => !prev)} />) : (<AlignLeft onClick={() => setIsOpen(prev => !prev)} />)}
      </div>
    </div>  
      </>
  )
}

export default Navbar