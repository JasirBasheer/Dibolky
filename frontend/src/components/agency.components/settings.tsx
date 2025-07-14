import { useEffect, useState } from 'react';
import { Cable, Check, CreditCard, ExternalLink, GitCommitHorizontal, MoreVertical, Settings, User, X, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { IConnection, RootState } from '@/types/common.types';
import { fetchConnections, getConnectSocailMediaUrlApi } from '@/services/common/get.services';
import { handleLinkedinAndXCallbackApi, savePlatformTokenApi } from '@/services/common/post.services';
import { setUser } from '@/redux/slices/user.slice';
import { Button } from '../ui/button';
import Skeleton from 'react-loading-skeleton';
import PaymentIntegrationModal from '../common.components/integrate-payment.modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { getPaymentIntegrationsStatus } from '@/services/agency/get.services';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import ProfileContents from '../common.components/auth/editProfile';
import { toast } from 'sonner';
import CustomBreadCrumbs from '../ui/custom-breadcrumbs';


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency)
  const [required, setRequired] = useState<string[]>([]);
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [paymentIntegrationTutorialUrl, setPaymentIntegrationTutorialUrl] = useState<string>("")
  const [currentPaymentProvider, setCurrentPaymentProvider] = useState<string>("")





  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');

    if (tab) setActiveTab(tab);

    const hash = window.location.hash;
    const provider = searchParams.get('provider');
    const token = new URLSearchParams(hash.substring(1)).get('access_token');
    if (hash && provider) {
      if (token) {
        handleCallback(token, provider).then(() => {
          window.history.replaceState({}, "", `${window.location.pathname}?tab=social-integrations&`);
          setActiveTab('social-integrations')
        })
      }
    }
    if(provider == "linkedin" || provider == "x"){
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    console.log(code,state,'reached')
    if(code && state){
      handleCallback(code,provider,state).then(()=>{
             window.history.replaceState({}, "", `${window.location.pathname}?tab=social-integrations&`);
          setActiveTab('social-integrations')
      })
    }
    }
    const required = searchParams.get("required")?.split(",") || []
    if (required.length > 0) {
      setRequired(required)
      toast.warning('Please connect the required platforms')
    }

  }, []);


  const { data: paymentIntegrationStatus, isLoading: isPaymentIntegrationStatusLoading, refetch } = useQuery({
    queryKey: ["get-payment-integration-status"],
    queryFn: () => {
      return getPaymentIntegrationsStatus()
    },
    select: (data) => data?.data.paymentIntegrationStatus,
    staleTime: 1000 * 60 * 60,
  })

  const { data: connections } = useQuery({
    queryKey: ["get-connections-status"],
    queryFn: () => {
      return fetchConnections(user.role, user.user_id)
    },
    select: (data) => data?.data.connections,
    enabled: !!user.user_id,
    staleTime: 1000 * 60 * 60,
  })




  const handleCallback = async (
    token: string,
    provider: string,
    status?:string
  ): Promise<object | undefined> => {
    try {

      if(provider == "linkedin" || provider == "x"){
       const response = await handleLinkedinAndXCallbackApi(token,status as string,provider)
       if(!response)throw new Error("token not found")
       console.log('reached here here is the response',response)
       if(response)token = response.data.token
      }
      

      const user_id = localStorage.getItem('selectedClient') as string
      const response = await savePlatformTokenApi(
        user_id == agency?.user_id ? "agency" : "client",
        provider,
        user_id == agency.user_id ? "agency" : user_id,
        token);

      if (response) {
        if (provider == "instagram") {
          dispatch(setUser({ instagramAccessToken: token }))
        } else if (provider == "facebook") {
          dispatch(setUser({ facebookAccessToken: token }))
        }
        toast.success(`${provider} connected successfully`)

        return response;
      } else {
        toast.error(`faced some issues while connect ${provider} please try again later `)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in handleCallback:", error.message);
      } else {
        console.error("Error in handleCallback:", error);
      }
      throw error;
    }

  };


  const handleConnectSocailMedia = async (
    connectionEndpoint: string,
    platform: string
  ): Promise<void> => {
    try {
      const urlQuery = new URL(window.location.href);
      urlQuery.searchParams.set("provider", platform);
      const redirectUri = encodeURIComponent(urlQuery.toString());
      const response = await getConnectSocailMediaUrlApi(`${connectionEndpoint}?redirectUri=${redirectUri}`)

      const url = new URL(response?.data.url);
      window.location.href = url.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error);
      }
    }
  };




  function getSocialMediaIcon(platform: string) {
    const platformLower: string = platform.toLowerCase();

    const icons: Record<string, string> = {
      facebook: 'M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z',
      instagram: 'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.044.976.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.044 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.044-.976-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z',
      x: 'M18.901 2.289h-3.346L8.978 9.743 3.099 2.289H0l7.071 10.286L0 21.711h3.346l7.071-8.457 5.879 8.457h3.099l-7.071-10.286 7.071-8.457z',
      linkedin: 'M22 3.47C22 2.65 21.35 2 20.53 2H3.47C2.65 2 2 2.65 2 3.47v17.06C2 21.35 2.65 22 3.47 22h17.06c.82 0 1.47-.65 1.47-1.47V3.47zM6.67 18H4V8.67h2.67V18zm-1.33-10.67c-.86 0-1.56-.7-1.56-1.56s.7-1.56 1.56-1.56 1.56.7 1.56 1.56-.7 1.56-1.56 1.56zm14.66 10.67h-2.67v-5.33c0-1.27-.45-2.13-1.58-2.13-.86 0-1.37.58-1.6 1.14-.08.2-.1.48-.1.76v5.56H11.33V8.67h2.56v1.14c.38-.58 1.06-1.4 2.58-1.4 1.9 0 3.33 1.24 3.33 3.9v5.69z'
    };
    if (!icons[platformLower]) return `M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z`;
    return icons[platformLower]
  }

  function formatRelativeTime(dateString: Date | string, addSuffix: boolean = true): string {
    try {
      const date = parseISO(String(dateString));
      return formatDistanceToNow(date, { addSuffix });
    } catch (error) {
      return dateString  as string
    }
  }





  const SocialIntegrationsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Platforms</h3>
      </div>
      <div className={`flex items-center justify-between p-4 border  bg-grey-200 rounded`}>
        <div className="flex items-center  space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png' alt='Instagram' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Instagram</h4>
            {user.instagramAccessToken !== "" ? (
              <p className="text-sm text-green-600">Connected </p>
            ) : (
              required.includes('instagram') ? (
                <p className="text-sm text-gray-700">Connection required..</p>
              ) : (
                <p className="text-sm text-gray-500">Not connected</p>)
            )}
          </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 ${user.instagramAccessToken !== "" ?
          'border border-red-300 text-red-600 hover:bg-red-50'
          : ` ${required.includes('instagram') ? "bg-black hover:bg-gray-700" : "bg-blue-700 hover:bg-blue-800"} text-white `
          } transition`}>
          {user.instagramAccessToken !== "" ? (
            'Disconnect'
          ) : (
            <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/instagram', 'instagram')}>
              <span>Connect</span>
              <ExternalLink size={14} />
            </div>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">FaceBook</h4>
            {user.facebookAccessToken !== "" ? (
              <p className="text-sm text-green-600">Connected </p>
            ) : (
              required.includes('facebook') ? (
                <p className="text-sm text-gray-700">Connection required..</p>
              ) : (
                <p className="text-sm text-gray-500">Not connected</p>)
            )}
          </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 ${user.facebookAccessToken !== "" ?
          'border border-red-300 text-red-600 hover:bg-red-50'
          : ` ${required.includes('facebook') ? "bg-black hover:bg-gray-700" : "bg-blue-700 hover:bg-blue-800"} text-white`
          } transition`}>
          {user.facebookAccessToken !== "" ? (
            'Disconnect'
          ) : (
            <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/facebook', 'facebook')}>
              <span>Connect</span>
              <ExternalLink size={14} />
            </div>
          )}
        </button>
      </div>


      <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Linked In</h4>
            {user.linkedinAccessToken !== "" ? (
              <p className="text-sm text-green-600">Connected </p>
            ) : (
              required.includes('linkedin') ? (
                <p className="text-sm text-gray-700">Connection required..</p>
              ) : (
                <p className="text-sm text-gray-500">Not connected</p>)
            )}  
               </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 ${user.linkedinAccessToken !== "" ?
          'border border-red-300 text-red-600 hover:bg-red-50'
          : ` ${required.includes('linkedin') ? "bg-black hover:bg-gray-700" : "bg-blue-700 hover:bg-blue-800"} text-white`
          } transition`}>
            {user.linkedinAccessToken !== "" ? (
            'Disconnect'
          ) : (
          <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/linkedin', 'linkedin')}>
            <span>Connect</span>
            <ExternalLink size={14} />
          </div>
          )}

        </button>
      </div>

    
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?t=st=1741153885~exp=1741157485~hmac=b159ae34d29580cfef086c305907d1ae7952b8b6ba01d3b7196d5f9bc1b12e89&w=900' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">X</h4>
             {user.xAccessToken !== "" ? (
              <p className="text-sm text-green-600">Connected </p>
            ) : (
              required.includes('x') ? (
                <p className="text-sm text-gray-700">Connection required..</p>
              ) : (
                <p className="text-sm text-gray-500">Not connected</p>)
            )} 
          </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 ${user.xAccessToken !== "" ?
          'border border-red-300 text-red-600 hover:bg-red-50'
          : ` ${required.includes('x') ? "bg-black hover:bg-gray-700" : "bg-blue-700 hover:bg-blue-800"} text-white`
          } transition`}>
            {user.xAccessToken !== "" ? (
            'Disconnect'
          ) : (
          <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/x', 'x')}>
            <span>Connect</span>
            <ExternalLink size={14} />
          </div>
            )} 
        </button>
      </div>


        <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/archive/c/c1/20210313114223%21Google_%22G%22_logo.svg' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Google</h4>
            <p className="text-sm text-gray-500">Not connected</p>
          </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 $ bg-blue-700 hover:bg-blue-800" text-white transition`}>
          <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/facebook', 'facebook')}>
            <span>Connect</span>
            <ExternalLink size={14} />
          </div>
        </button>
      </div>


    </div>
  );





  const PaymentIntegrationsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Payment Gateways</h3>
      </div>


      <div className={`flex items-center justify-between p-4 border  bg-grey-200 rounded`}>
        <div className="flex items-center  space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_awAhWbcBFYxdA0BCF6Y-dZP_0nbXCnRrEuCyf_5Tsoy88XrQ5PbSU5_00ygMQ5Az_s&usqp=CAU' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Razorpay</h4>
            {paymentIntegrationStatus && paymentIntegrationStatus?.isRazorpayIntegrated ? (<p className="text-sm text-green-600">Integrated</p>) : (<p className="text-sm text-gray-500">Not integrated</p>)}


          </div>
        </div>
        {isPaymentIntegrationStatusLoading ? (
          <>
            <Skeleton height={25} width={90} />
          </>
        ) : (
          <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 bg-black text-white transition`}>
            <div className='w-full flex items-center justify-between gap-2'
              onClick={() => {
                setPaymentIntegrationTutorialUrl("https://www.youtube.com/embed/aLLI9UwNMl0?si=JQg5Q1RLNbyL1G8T")
                setCurrentPaymentProvider("razorpay")
                setIsModalOpen(true)
              }
              }>
              <span>
                {paymentIntegrationStatus.isRazorpayIntegrated ? "Re Integrate" : "Integrate"}

              </span>
              <Cable size={14} />
            </div>
          </button>
        )}

      </div>


      <div className={`flex items-center justify-between p-4 border  bg-grey-200 rounded`}>
        <div className="flex items-center  space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlXQfoxEWFHosgkF9qA78PE_wQzqHKRGthXKVeS1hRBe27oqxJ8lCbz34LRPKaCvT3Bc&usqp=CAU' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Stripe</h4>
            {paymentIntegrationStatus && paymentIntegrationStatus?.isStripeIntegrated ? (<p className="text-sm text-green-600">Integrated</p>) : (<p className="text-sm text-gray-500">Not integrated</p>)}
          </div>
        </div>

        {isPaymentIntegrationStatusLoading ? (
          <>
            <Skeleton height={25} width={90} />
          </>
        ) : (
          <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 bg-black text-white transition`}>
            <div className='w-full flex items-center justify-between gap-2'
              onClick={() => {
                setPaymentIntegrationTutorialUrl("https://www.youtube.com/embed/7edR32QVp_A?si=nHaQBAWtpeaeA40l")
                setCurrentPaymentProvider("stripe")
                setIsModalOpen(true)
              }
              }>
              <span>
                {paymentIntegrationStatus && paymentIntegrationStatus?.isStripeIntegrated ? "Re Integrate" : "Integrate"}

              </span>
              <Cable size={14} />
            </div>
          </button>
        )}
      </div>
      <PaymentIntegrationModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        tutorialUrl={paymentIntegrationTutorialUrl}
        provider={currentPaymentProvider}
        refetch={refetch}
      />
    </div>

  );




  const ConnectionContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium">This is the list of all connections that you made.
        </p>
      </div>


      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          {/* <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search contacts ..." 
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
  
        </div> */}
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-[0.7rem] text-gray-600">INTEGRATION</TableHead>
                <TableHead className="font-bold text-[0.7rem] text-gray-600">SYNC</TableHead>
                <TableHead className="font-bold text-[0.7rem] text-gray-600">CREATED AT</TableHead>
                <TableHead className="font-bold text-[0.7rem] text-gray-600">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {connections?.map((connection: IConnection, index: number) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="currentColor"
                        >
                          <path d={getSocialMediaIcon(connection.platform)} />
                        </svg>
                      </span>
                      {connection.platform}
                    </div>
                  </TableCell>


                  <TableCell>
                    {connection.is_valid ? (
                      <span className="flex items-center justify-center bg-green-100 text-green-600 rounded-full w-6 h-6">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center bg-red-100 text-red-600 rounded-full w-6 h-6">
                        <X className="h-4 w-4" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatRelativeTime(connection.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Re connect</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* 
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing 1 of 1 pages</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
      </div>


    </div>

  );


  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <ProfileContents />;
      case 'social-integrations':
        return <SocialIntegrationsContent />;
      case 'payment-integrations':
        return <PaymentIntegrationsContent />;
      case 'connections':
        return <ConnectionContent />
      default:
        return (
          <div className="py-10 text-center">asdf</div>
        );
    }
  };
  const tabs = [
    { id: 'about', label: 'About', icon: <User size={18} /> },
    { id: 'social-integrations', label: 'Social Integrations', icon: <Zap size={18} /> },
    { id: 'payment-integrations', label: 'Payment Integrations', icon: <CreditCard size={18} /> },
    { id: 'connections', label: 'Connections', icon: <GitCommitHorizontal size={18} /> },
    { id: 'account-security', label: 'Account Security', icon: <Settings size={18} /> },
  ];
  return (
    <>
        <CustomBreadCrumbs
        breadCrumbs={[
          ["Tools & Inegration", "/agency"],
          ["Settings", ""],
        ]}
      />
    <div className="min-h-screen bg-gray-50 dark:bg-[#191919] pb-7">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              <div className="w-full md:w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium">Settings</h2>
                  <p className="text-sm text-gray-500">Manage your account</p>
                </div>
                <nav className="py-4">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-6 py-3 text-sm ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600  border-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex-1 p-6">
                <h2 className="text-xl font-medium mb-6">{tabs.find(tab => tab.id === activeTab)?.label} Settings</h2>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
  );
};

export default SettingsPage;