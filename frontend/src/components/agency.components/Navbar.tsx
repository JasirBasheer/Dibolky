import { setUser } from '@/redux/slices/userSlice';
import axios from '@/utils/axios';
import { AlignLeft, Bell, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setClient } from '@/redux/slices/clientSlice';

type NavbarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Client = {
  _id: string;
  name: string;
};
interface SocialMediaConfig {
  name: string;
  buttonText: string;
  connectEndpoint: string;
}

const socialMediaConfigs: Record<string, SocialMediaConfig> = {
  instagram: {
    name: 'instagram',
    buttonText: 'Connect Instagram',
    connectEndpoint: '/api/client/connect/instagram'
  },
  facebook: {
    name: 'facebook',
    buttonText: 'Connect Facebook',
    connectEndpoint: '/api/client/connect/facebook'
  },
  x: {
    name: 'x',
    buttonText: 'Connect X',
    connectEndpoint: '/api/client/connect/x'
  }
};


const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [clients, setClients] = useState<Client[]>([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [client, setSelectedClient] = useState({})
  const dispatch = useDispatch()
  const details = useSelector((state: any) => state?.user)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()



  useEffect(() => {
    const selectedClient = localStorage.getItem('selectedClient')
    if (selectedClient) {
      dispatch(setUser({ Id: selectedClient }))
      dispatch(setUser({ role: "Agency-Client" }))
    } else {
      dispatch(setUser({ role: "Agency" }))
    }

    fetchAllClients()
  }, [dispatch])

  const fetchAllClients = async () => {
    try {
      const response = await axios.get("/api/agency/clients")
      setClients(response.data.clients)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleLogout = async() =>{
    try {
      const response = await axios.post(`/api/auth/logout`)
      if(response){
        navigate('/login')
      }
      
    } catch (error:any) {
      console.log(error.message);
      
    }
  }


  const fetchSelectedClient = async () => {
    try {
      const response = await axios.get(`/api/agency/client/${details.Id}`)
      console.log("res", response)
      if (!response.data) return null
      console.log(response.data)
      dispatch(setClient({
        facebookAccessToken: response?.data?.client?.socialMedia_credentials?.facebook?.accessToken || "",
        facebookUsername: response?.data?.client?.socialMedia_credentials?.facebook?.userName || "",
        instagramAccessToken: response?.data?.client?.socialMedia_credentials?.instagram?.accessToken || "",
        instagramUsername: response?.data?.client?.socialMedia_credentials?.instagram?.userName || ""
      }));
      console.log(response.data.client)

      setSelectedClient(response.data.client)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }
  const handleSelect = (id: string) => {
    const clientId = id === "default" ? "" : id;
    dispatch(setUser({ Id: clientId }))
    dispatch(setUser({ role: clientId ? "Agency-Client" : "Agency" }))
    localStorage.setItem('selectedClient', clientId)
    navigate('/agency')
  }

  useEffect(() => {
    if (details.Id != "") {
      fetchSelectedClient()
    }
  }, [details.Id])


  useEffect(() => {
    const selectedClient = localStorage.getItem('selectedClient')
    const hash = window.location.hash;
    const provider = searchParams.get('provider');
    if (hash && provider) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        handleCallback(token, provider).then(() => {
          handleSelect(selectedClient || "")
          setSelectedClient(prev => ({ ...prev }));
          console.log("selected client rerendered")
          window.location.href = "/agency"

        })
      }
    }
  }, []);

  const handleCallback = async (token: string, provider: string): Promise<any> => {
    try {
      const selectedClient = localStorage.getItem('selectedClient')
      console.log(`Handling callback for ${provider} with token:`, token);
      console.log(provider, token, details.Id)
      const response = await axios.post(
        `/api/client/save-platform-token/${provider}/${selectedClient && selectedClient != "" ? selectedClient : "Agency"}`,
        { token }
      );
      if (response) {
        message.success(`${provider} connected successfully`)
        return response;
      } else {
        message.error(`faced some issues while connect ${provider} please try again later `)

      }

    } catch (error: any) {
      console.log('Error in handleCallback:', error);
      throw error;
    }
  };
  const handleConnectSocailMedia = async (platform: string): Promise<void> => {
    try {
      const response = await axios.get(`${socialMediaConfigs[platform].connectEndpoint}?redirectUri=${window.location + `?provider=${platform}`}`);
      const url = new URL(response?.data.url);
      window.location.href = url.toString();
    } catch (error: any) {
      console.log("Error:", error.response?.data || error.message);
    }
  };




  return (
    <div className='relative grid grid-cols-12 min-h-[4.5rem]'>
      <div className="col-span-2 bg-white flex items-center justify-start pl-9 text-blue-600 text-2xl font-bold">Dibolky</div>
      <div className="lg:col-span-6 col-span-6"></div>
      <div className="lg:col-span-4 flex items-center lg:pl-12 gap-7">
        <div className="lg:flex hidden gap-x-4">
          <Select
            onValueChange={handleSelect}
            value={details.Id || "default"}
          >
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none bg-white cursor-pointer shadow-sm hover:border-blue-400">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default" className="px-2 py-1 min-w-[11rem]">
                  Owner
                </SelectItem>
                {clients.map((client) => (
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

          <Select value={"default"}>
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none bg-white cursor-pointer shadow-sm hover:border-blue-400">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default" className="px-2 py-1 min-w-[11rem]">
                  Employees
                </SelectItem>
                {clients.map((client) => (
                  <SelectItem
                    key={client._id}
                    value={client._id}
                    className="px-2 py-1 min-w-[16rem]"
                  >
                    <div className="flex gap-3">
                      <img src="https://oliver-andersen.se/wp-content/uploads/2018/03/cropped-Profile-Picture-Round-Color.png" alt="" className='w-7' />  {client.name}
                    </div>
                  </SelectItem>
                ))}
                <Button className='w-full'>Save</Button>
              </SelectGroup>
            </SelectContent>
          </Select>
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
              <p className="font-semibold">{client?.name ||""}</p>
              <p className="text-xs text-gray-500">{client.email ||""}</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="font-medium mb-2">Connect Platforms</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(client?.socialMedia_credentials || {})
                .filter(platform => !client?.socialMedia_credentials[platform]?.accessToken)
                .map((platform, index) => (
                  <div
                    key={index}
                    onClick={() => handleConnectSocailMedia(platform)}
                    className="
                   px-2 h-7 rounded-md flex items-center justify-center 
                   bg-slate-200 text-slate-600 text-xs cursor-pointer
                 "
                  >
                    Connect {platform}
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-slate-200 w-[4rem] flex items-center justify-center rounded-sm h-7 mt-2 cursor-pointer" onClick={handleLogout}>Logout</div>
        </div>
      )}

      <div className="lg:hidden col-span-2 flex items-center">
        {isOpen ? (<X onClick={() => setIsOpen(prev => !prev)} />) : (<AlignLeft onClick={() => setIsOpen(prev => !prev)} />)}
      </div>
    </div>
  )
}

export default Navbar