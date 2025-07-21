import { useEffect, useState } from 'react';
import { Cable, CreditCard, ExternalLink, Mail, WrapText, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {  RootState } from '@/types/common';
import { fetchConnections, getConnectSocailMediaUrlApi } from '@/services/common/get.services';
import { handleLinkedinAndXCallbackApi, savePlatformTokenApi } from '@/services/common/post.services';
import { setUser } from '@/redux/slices/user.slice';
import Skeleton from 'react-loading-skeleton';
import PaymentIntegrationModal from '@/components/common/integrate-payment.modal';
import { getPaymentIntegrationsStatus } from '@/services/agency/get.services';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import CustomBreadCrumbs from '@/components/ui/custom-breadcrumbs';


const Integrations = () => {
  const [activeTab, setActiveTab] = useState('social-integrations');
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



    </div>
  );





  const MailIntegrationsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Platforms</h3>
      </div>


        <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/archive/c/c1/20210313114223%21Google_%22G%22_logo.svg' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Google Mail</h4>
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







  const LeadIntegrationsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Platforms</h3>
      </div>


        <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/archive/c/c1/20210313114223%21Google_%22G%22_logo.svg' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Google Ads</h4>
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





  const renderContent = () => {
    switch (activeTab) {
      case 'social-integrations':
        return <SocialIntegrationsContent />;
      case 'payment-integrations':
        return <PaymentIntegrationsContent />;
      case 'mail-integrations':
        return <MailIntegrationsContent />;
      case 'lead-integrations':
        return <LeadIntegrationsContent />;
      default:
        return (
          <div className="py-10 text-center">asdf</div>
        );
    }
  };
  const tabs = [
    { id: 'social-integrations', label: 'Social Integrations', icon: <Zap size={18} /> },
    { id: 'mail-integrations', label: 'Mail Integrations', icon: <Mail size={18} /> },
    { id: 'lead-integrations', label: 'Lead Integrations', icon: <WrapText size={18} /> },
    { id: 'payment-integrations', label: 'Payment Integrations', icon: <CreditCard size={18} /> },
  ];
  return (
    <>
        <CustomBreadCrumbs
        breadCrumbs={[
          ["Tools & Settings", "/agency"],
          ["Integrations", ""],
        ]}
      />
    <div className="dark:bg-[#191919] pb-7">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              <div className="w-full md:w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium">Integrations</h2>
                  <p className="text-sm text-gray-500">Manage your Integrations</p>
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

export default Integrations;