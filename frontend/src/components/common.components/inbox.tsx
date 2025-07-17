import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomBreadCrumbs from "../ui/custom-breadcrumbs";
import { PlatformFilter } from "./platfrom-filter";
import { useQuery } from "@tanstack/react-query";
import { fetchConnections, getInboxMessagesApi } from "@/services/common/get.services";
import { useSelector } from "react-redux";
import { RootState } from "@/types/common.types";
import { ISocialUserType } from "@/types/social-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInboxConversations } from "@/services/common/post.services";
import { Skeleton } from "../ui/skeleton";
import { ISocialMessageType } from "@/types/social-message";

const Inbox = () => {
  const [selectedTab, setSelectedTab] = useState("not-replied");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [users, setUsers] = useState<ISocialUserType[]>([]);
  const [isUsersLoading , setUsersLoading] = useState<boolean>(false)
  const [selectedConversation , setSelectedConversation] = useState<ISocialUserType | null>(null)
  const [messages, setMessages] = useState<ISocialMessageType[] | null>([])
  const [message, setMessage] = useState<ISocialMessageType | null>()

  const user = useSelector((state: RootState) => state.user);

  const { data: connections } = useQuery({
    queryKey: ["get-connections-status"],
    queryFn: () => {
      return fetchConnections(user.role, user.user_id);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
    staleTime: 1000 * 60 * 60,
  });

  const handleFilterChange = (connections: string[], platforms: string[]) => {
    setSelectedConnections(connections);
    setSelectedPlatforms(platforms);
  };

useEffect(() => {
  setUsersLoading(true)
  const debounceTimer = setTimeout(() => {
    async function getConversations() {
      const response = await getInboxConversations(
        user.role,
        user.user_id,
        selectedPlatforms,
        selectedConnections
      );
      setUsers(response.data.users || []);
      setUsersLoading(false)
    }

    getConversations();
  }, 900); 
  return () => clearTimeout(debounceTimer); 
}, [selectedPlatforms, selectedConnections]);

  async function getInboxMessages(platform:string, conversationId:string) {
    const response = await getInboxMessagesApi(user.user_id, platform, conversationId);
    const sortedMessages = (response.data.messages || []).sort((a: ISocialMessageType, b: ISocialMessageType) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    setMessages(sortedMessages);

  }

  useEffect(() => {
    if(selectedConversation){
      const isSelectedUserExists = users.find(user => user._id == selectedConversation?._id);
      if (!isSelectedUserExists){
        setSelectedConversation(null);
        setMessages(null)
      }else{
      getInboxMessages(selectedConversation.platform,selectedConversation.conversationId)
      }
    }
}, [users, selectedConversation]);

  function handleSelectConversation (user:ISocialUserType){
    setSelectedConversation(user)
  }

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Communications", "/agency/inbox"],
          ["Inbox", ""],
        ]}
      />
      <div className="md:flex h-screen w-full mx-auto  border-l-gray-300 bg-white">
        <div className="md:w-[34em] p-5 w-full  h-full border-r border-l-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">My Inbox</h1>
            <PlatformFilter
              connections={connections}
              onFilterChange={handleFilterChange}
              selectedConnections={selectedConnections}
              selectedPlatforms={selectedPlatforms}
            />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search messages"
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>

          <Tabs defaultValue="not-replied" className="mb-6">
            <TabsList className="grid grid-cols-3 bg-slate-100">
              <TabsTrigger
                value="not-replied"
                onClick={() => setSelectedTab("not-replied")}
                className="flex gap-2 items-center"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="open"
                onClick={() => setSelectedTab("open")}
                className="flex gap-2 items-center"
              >
                Not Replied
              </TabsTrigger>
              <TabsTrigger
                value="replied"
                onClick={() => setSelectedTab("replied")}
              >
                Replied
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 overflow-y-auto">
            {users.length == 0 && !isUsersLoading  ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-xs">
                  Make sure you have selected pages too.
                </p>
                <p className="text-gray-500 text-sm">
                  No messages match your current filters.
                </p>
              </div>
            ) : (
              <div>
                {isUsersLoading == true
                ? (
                [1,2,3].map((item,index)=>{
                  return (
                    <div key={index} className="flex mb-4 items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  )
                })
                ) : (
                  users.map((user, index) => (
                  <div
                    key={index}
                    onClick={()=>handleSelectConversation(user)}
                    className="bg-gray-100 flex items-center mb-2 cursor-pointer  p-3 py-5  rounded-md"
                  >
                    <Avatar className="h-10  w-10 rounded-lg">
                      <AvatarImage src={user.profile} alt={user.name} />
                      <AvatarFallback className="bg-gray-300 rounded-full">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="">
                    <p className="text-sm ml-4"> {user.name}</p>
                    <p className="text-xs ml-4"> {user.userName}</p>
                    </div>
                  </div>
                ))
                )}
             
              </div>
            )}
          </div>
        </div>

  <div 
          className={` w-full h-screen transition-all duration-500 ease-in-out`}
        >          {!selectedConversation ? 
          <div className="flex justify-center w-full  h-full items-center">
            <div className="text-center mb-20 ">
            <span className="text-4xl">👋</span>
            <h2 className="text-3xl font-bold mt-2">Hi, from Dibolky</h2>
            <p className="text-slate-500 mb-1">Your have no messages</p>
            <p className="text-slate-500 text-xs">
              Please select a conversation to view messages.
            </p>
          </div>
          </div>
          : (
            <div className={` w-full h-full transition-all duration-500 ease-in-out ${
            selectedConversation 
              ? 'opacity-100 translate-y-0 ' 
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}>
              <div className="w-full  md:h-[73px] h-[79px] bg-gray-100 flex items-center px-4 shadow-sm">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-800">{selectedConversation.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedConversation.platform} • @{selectedConversation.userName}
                  </div>

                </div>
              </div>
              
              <div className="w-full md:h-[686px] h-[calc(100vh-228px)] bg-gray-50 p-4 overflow-y-auto">
                <div className="space-y-4">
                {messages?.map((msg)=>{
                  return msg.isFromMe ?(
                  
                  <div className=" bg-white text-black rounded-lg p-3 shadow-sm max-w-xs ml-auto">
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs text-black">{msg.createdAt?.toString()}</span>
                  </div>
                  ):(
                       <div className="bg-blue-500 text-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs text-white">{msg.createdAt?.toString()}</span>
                  </div>
                  )
                })}
                </div>
              </div>

              <div className="w-full md:h-[62px] h-[79px] bg-gray-100 border-t flex items-center px-4">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Inbox;
