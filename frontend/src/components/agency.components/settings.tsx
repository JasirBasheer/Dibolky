import { useEffect, useState } from 'react';
import { Cable, Camera, CreditCard, Edit, ExternalLink, GitCommitHorizontal, Save, Settings, User, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/types/common.types';
import { getConnectSocailMediaUrlApi } from '@/services/common/get.services';
import { getSignedUrlApi, getUploadUrlApi, savePlatformTokenApi, updateProfileApi } from '@/services/common/post.services';
import { setUser } from '@/redux/slices/userSlice';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Separator } from '@radix-ui/react-select';
import axios from 'axios';
import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency)
  const [required, setRequired] = useState<string[]>([]);
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [userData, setUserData] = useState({
    tenant_id: user.user_id,
    main_id: user.main_id,
    name: user.name,
    email: user.email,
    bio: user?.bio || "bio",
    profile: user.profile || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }




  const handleSave = async () => {
    try {
      if (userData.name.trim() == "" || userData.bio.trim() == "") {
        message.warning("please fill the inputs accordingly")
        return
      }
      setIsLoading(true);
      const role = user.role === "agency" ? user.role : "client";
      let profileKey = user.profile;

      if (profilePicture) {
        const fileData = {
          fileName: profilePicture.name,
          fileType: profilePicture.type, 
          fileSize: profilePicture.size
        };

        const response = await getUploadUrlApi(fileData);

        await axios.put(response?.data?.s3file.url, profilePicture, {
          headers: {
            'Content-Type': response?.data?.s3file.contentType,
            'Content-Disposition': 'inline',
          },
        });

        profileKey = response?.data?.s3file?.key || "";
      }

      const updatedUserData = {
        ...userData,
        profile: profileKey
      };

      const updateResponse = await updateProfileApi(role, updatedUserData);

      if (updateResponse) {
        message.success("Profile successfully updated");

        const updatedUser = {
          name: updateResponse.data.details.name,
          bio: updateResponse.data.details.bio,
          profile: updateResponse.data.details.profile,
        };


        dispatch(setUser({ name: updatedUser.name, bio: updatedUser.bio, profile: updatedUser.profile }));

        setIsEditing(false);
        setProfilePicture(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    console.log('enteredddddddddddddddddddddddddddddd');
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
    const required = searchParams.get("required")?.split(",") || []
    if (required.length > 0) {
      setRequired(required)
      message.warning('Please connect the required platforms')
    }

  }, []);

  useEffect(() => {
    setUserData({
      tenant_id: user.user_id,
      main_id:user.main_id,
      name: user.name || '',
      email: user.email || '',
      bio: user?.bio || '',
      profile: user.profile || '',
    });

    const loadProfileImage = async () => {
      try {
        if (userData.profile && userData.profile !== "") {
          setIsProfileLoading(true)
          const signedUrlRes = await getSignedUrlApi(user.profile as string)

          if (signedUrlRes.data && signedUrlRes.data.signedUrl) {
            setUserData((prev) => ({
              ...prev,
              profile: signedUrlRes.data.signedUrl
            }));
            setIsProfileLoading(false)

          }
        }
      } catch (error) {
        setIsProfileLoading(false)
        console.error("Error loading profile image:", error);
      }
    };

    loadProfileImage();
  }, [user]);



  const handleCallback = async (
    token: string,
    provider: string
  ): Promise<object | undefined> => {
    try {
      const user_id = localStorage.getItem('selectedClient') as string
      console.log(agency?.user_id,"user id from agency stateeeeeeeeeeeeeeeeeeeeeee")
      const response = await savePlatformTokenApi(
        user_id == agency?.user_id ? "agency" : "client",
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        message.error("Only image files (jpeg, png, jpg, gif) are supported");
        return;
      }
      setIsProfileLoading(true)

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(file);
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsProfileLoading(false)

    }
  };



  
  const ProfileContents = () => (
    <Card className="overflow-hidden">
    <div className="relative px-6">
      <div className="flex  justify-between items-end">
        {isEditing ? (
          isProfileLoading ? (
            <>
              <Skeleton height={74} className='mt-6' width={74} borderRadius={50} />
            </>
          ) : (
            <div className="relative group">
              <Avatar className="h-24 w-24 mt-6 border-4 border-background">
                <AvatarImage src={
                  profileImageUrl
                    ? profileImageUrl
                    : (userData.profile || '')
                } 
                className="h-full w-full object-cover"
                alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 mt-6 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
          )
        ) : (
          isProfileLoading ? (
            <>
              <Skeleton height={74} className='mt-6' width={74} borderRadius={50} />
            </>
          ) : (
            <Avatar className="h-24 w-24 mt-6 border-4 border-background overflow-hidden rounded-full">
              <AvatarImage
                src={userData.profile || ''}
                alt={userData.name}
                className="h-full w-full object-cover"
              />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>

          )

        )
        }
        <div className="ml-auto absolute top-4 right-6">
          {
            isLoading ? (
              <>
                <Skeleton height={32} className='mr-2 h-4 w-4' width={74} />
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                {isEditing ? (

                  <>
                    <Save className="mr-2 h-4 w-4" /> Save
                  </>

                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </>
                )}
              </Button>
            )
          }

        </div>
      </div>
    </div>

    <CardContent className="pt-6 space-y-6">
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={userData.name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={userData.bio} onChange={handleChange} rows={3} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{userData.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Joined</h3>
              <p className="text-sm text-muted-foreground">March 2023</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Role</h3>
              <p className="text-sm text-muted-foreground">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
  );


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
            <img src='https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?t=st=1741153885~exp=1741157485~hmac=b159ae34d29580cfef086c305907d1ae7952b8b6ba01d3b7196d5f9bc1b12e89&w=900' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">X</h4>
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

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg' alt='FaceBook' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Tik tok</h4>
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
                <p className="text-sm text-gray-500">Not integrated</p>
          </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 bg-blue-700 hover:bg-blue-800"} text-white transition`}>
            <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/instagram', 'instagram')}>
              <span>Integrate</span>
              <Cable size={14} />
            </div>
        </button>
      </div>


      <div className={`flex items-center justify-between p-4 border  bg-grey-200 rounded`}>
        <div className="flex items-center  space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlXQfoxEWFHosgkF9qA78PE_wQzqHKRGthXKVeS1hRBe27oqxJ8lCbz34LRPKaCvT3Bc&usqp=CAU' className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">Stripe</h4>
                <p className="text-sm text-gray-500">Not integrated</p>
          </div>
        </div>
        <button className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 bg-blue-700 hover:bg-blue-800"} text-white transition`}>
            <div className='w-full flex items-center justify-between gap-2' onClick={() => handleConnectSocailMedia('/api/entities/connect/instagram', 'instagram')}>
              <span>Integrate</span>
              <Cable size={14} />
            </div>
        </button>
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
        return <PaymentIntegrationsContent/>;
      default:
        return (
          <div className="py-10 text-center"></div>
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