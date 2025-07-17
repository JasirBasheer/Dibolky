import { useEffect, useState } from "react"
import { Plus, Trash2, UserCircle } from "lucide-react"
import axios from "@/utils/axios"
import { message } from "antd"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import createSocketConnection from "@/utils/socket"
import { IAvailabeUser, IChatUser } from "@/types/chat.types"
import { getSignedUrlApi } from "@/services/common/post.services"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface MenuListModalProps {
  setShowMenuListModal: (show: boolean) => void
  userId: string;
  role: string;
  orgId:string;
  userName:string;
  profile:string;
}



export const MenuListModal = ({ setShowMenuListModal, userId, role ,orgId ,userName,profile }: MenuListModalProps) => {
  
  const [groupName, setGroupName] = useState("")
  const [availableUsers, setAvailableUsers] = useState<IAvailabeUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<any[]>([])

  const filteredUsers = availableUsers.filter(
    (user:IAvailabeUser) =>
      user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedMembers.some((member) => member._id === user._id),
  )

  const fetchAvailableUsers = async () => {
    const res = await axios.get("/api/agency/availabe-users");
    const users = res.data.users || [];
    console.log(users)

    const usersWithUrls = await Promise.all(
      users.map(async (member:IAvailabeUser) => {
        let profileUrl = null;
        if (member?.profile) {
          const response = await getSignedUrlApi(member?.profile);
          profileUrl = response.data.signedUrl
        }
        return { ...member, profileUrl };
      })
    );
    
    setAvailableUsers(usersWithUrls);

  }

  



  useEffect(() => {
    fetchAvailableUsers()
  }, [])

  const addMember = (user: IAvailabeUser) => {
    setSelectedMembers([...selectedMembers, user])
    setSearchTerm("")
    setShowSuggestions(false)
  }



  const handleCreateGroup = async () => {
    try {
      if((selectedMembers.length + 1)<2){
        message.error('3 members atleast need to create group')
        return 
      }
      const socket = createSocketConnection()
      socket.emit('set-up',{orgId,userId})
      const details = {
        members: [...selectedMembers, { _id: userId, name: userName, type: role,profile }],
        groupName,
      }
      const res = await axios.post("/api/entities/create-group", { details, userId })
    
    
      if(res){
        const group = {
          ...res.data.group,
          message:[]
        }
        socket.emit("create-group",({group}))
      }
      setShowMenuListModal(false)
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data?: { error?: string } } };
        message.error(err.response.data?.error || "An unknown error occurred");
      } else {
        message.error("An unknown error occurred");
      }
    }
    
  }

  const handleCreateChat = async(targetUserId:string,targetUserName:string,targetUserProfile:string) =>{
    try {
      const socket = createSocketConnection()
      socket.emit('set-up',{orgId,userId})
      console.log(orgId,userId,"oneeee");
      console.log(profile,targetUserProfile,"one")
 
      socket.emit("create-chat",({userId,targetUserId,orgId,userName,targetUserName,targetUserProfile,userProfile:profile}))
      
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setShowMenuListModal(false)}
    >
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <Tabs defaultValue="newChat">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="newChat" className="flex items-center gap-2">
                <UserCircle size={16} />
                Create New Chat
              </TabsTrigger>
              <TabsTrigger value="createGroup" className="flex items-center gap-2">
                <Plus size={16} />
                Create Group
              </TabsTrigger>
            </TabsList>
            <TabsContent value="newChat">
              <div className="mt-6 space-y-4">
                {availableUsers.map((user:IAvailabeUser) =>  (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={()=>handleCreateChat(user._id as string,user.name,user.profile || "")}
                  >
           
                    <Avatar className="h-16 w-16 border-4 border-background">
                        <AvatarImage src={String(user?.profileUrl)} 
                        className="h-full w-full object-cover"
                        alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                    <div>
                      <p className="text-sm font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{}</p>
                    </div>
                  </div>
                  )
                )}
              </div>
            </TabsContent>
            <TabsContent value="createGroup">
              <div className="mt-6 space-y-4">
                <p className="text-sm text-slate-600">Create a new group by selecting users from the list below.</p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Enter group name"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Add Members</Label>
                    <div className="relative">
                      <Input
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setShowSuggestions(true)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search members..."
                      />
                      {showSuggestions && searchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user:IAvailabeUser) => (
                              <div
                                key={user._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => addMember(user)}
                              >
                                <div className="font-medium">{user?.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500">No matching users found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedMembers.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Members</Label>
                        <div className="space-y-2">
                          {selectedMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                            >
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                              <Button variant="ghost" size="icon" >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full flex items-center justify-center gap-2" onClick={handleCreateGroup}>
                  <Plus size={16} />
                  Create Group
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

