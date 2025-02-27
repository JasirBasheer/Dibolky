import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { AlignLeft, Bell, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { setUser } from '@/redux/slices/userSlice';
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




const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate()



  useEffect(() => {
    const selectedClient = localStorage.getItem('selectedClient')
    if (selectedClient) {
      dispatch(setUser({ user_id: selectedClient, role: "agency-client" }))
    } else {
      dispatch(setUser({ user_id: "", role: "agency" }))
    }
  }, [dispatch])


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
      let response;
      let role = 'agency-client'
      if (user.user_id == "") {
        response = await fetchAgencyOwnerDetailsApi()
        role = 'agency'
        if (!response.data) return null
      } else {
        response = await fetchClientApi(user.user_id)
        if (!response.data) return null
      }
      dispatch(setUser({
        name: response.data.details.name,
        email: response.data.details.email,
        orgId: response.data.details.orgId,
        planId: response.data.details.planId,
        organizationName: response.data.details.organizationName,
        facebookAccessToken: response.data.details?.socialMedia_credentials?.facebook?.accessToken || "",
        instagramAccessToken: response.data.details?.socialMedia_credentials?.instagram?.accessToken || "",
        role,ownerId:response.data.details?._id || ""
      }))
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred");
      }
    }
  }


  const handleSelect = (user_id: string) => {
    setIsProfileOpen(false)
    const userId = user_id === "default" ? "" : user_id;
    dispatch(setUser({ user_id: userId }))
    dispatch(setUser({ role: userId == "" ? "agency" : "agency-client" }))
    localStorage.setItem('selectedClient', userId)
    navigate('/agency')
  }


  useEffect(() => {
    fetchSelectedUser()
  }, [user.user_id,
      user.role,
      user.facebookAccessToken,
      user.instagramAccessToken
    ])

  return (
    <div className='relative grid grid-cols-12 min-h-[4.5rem]'>
      <div className="col-span-2 bg-white flex items-center justify-start pl-9 text-blue-600 text-2xl font-bold">Dibolky</div>
      <div className="lg:col-span-7 col-span-6"></div>
      <div className="lg:col-span-3 flex items-center lg:pl-12 gap-7">
        <div className="lg:flex hidden gap-x-4">

          {isClientsLoading ? (
            <Skeleton width={100} height={30} />
          ) : (<Select
            onValueChange={handleSelect}
            value={user.user_id || "default"}
          >
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none bg-white cursor-pointer shadow-sm hover:border-blue-400">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default" className="px-2 py-1 min-w-[11rem]">
                  Owner
                </SelectItem>
                {clients.map((client: NavClient) => (
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
  )
}

export default Navbar