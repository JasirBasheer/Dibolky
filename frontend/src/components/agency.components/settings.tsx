import { useEffect, useState } from 'react';
import { CreditCard, ExternalLink, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/types/common.types';
import { getConnectSocailMediaUrlApi } from '@/services/common/get.services';
import { savePlatformTokenApi } from '@/services/common/post.services';
import { message } from 'antd';
import { setUser } from '@/redux/slices/userSlice';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('social-integrations');
  const user = useSelector((state: RootState) => state.user);
  const [required, setRequired] = useState<string[]>([]);
  const dispatch = useDispatch()


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
          // window.location.reload()
        })
      }
    }
    const required = searchParams.get("required")?.split(",") || []
    if (required.length > 0) {
      setRequired(required)
      message.warning('Please connect the required platforms')
    }
  }, []);



  const handleCallback = async (
    token: string,
    provider: string
  ): Promise<object | undefined> => {
    try {
      const user_id = localStorage.getItem('selectedClient') as string
      const response = await savePlatformTokenApi(
        user_id == "" ? "agency" : "client",
        provider,
        user_id == "" ? "agency" : user_id,
        token);

      if (response) {
        if (provider == "instagram") {
          dispatch(setUser({ instagramAccessToken: token }))
        } else if (provider == "facebook") {
          dispatch(setUser({ facebookAccessToken: token }))
        }
        message.success(`${provider} connected successfully`)
        return response;
      } else {
        message.error(`faced some issues while connect ${provider} please try again later `)
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


  const IntegrationsContent = () => (
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
    </div>
  );



  const renderContent = () => {
    switch (activeTab) {
      case 'social-integrations':
        return <IntegrationsContent />;
      case 'payment-integrations':
        return (
          <div className="py-10 text-center">
            <h3 className="text-lg font-medium mb-2">Billing section</h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        );
      default:
        return (
          <div className="py-10 text-center"></div>
        );
    }
  };
  const tabs = [
    { id: 'social-integrations', label: 'Social Integrations', icon: <Zap size={18} /> },
    { id: 'payment-integrations', label: 'Payment Integrations', icon: <CreditCard size={18} /> },
  ];


  return (
    <div className="min-h-screen bg-gray-50 pb-7">
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
  );
};

export default SettingsPage;