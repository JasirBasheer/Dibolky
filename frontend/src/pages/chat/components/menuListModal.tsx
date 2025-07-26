import { useEffect, useState } from "react"
import { UserCircle } from "lucide-react"
import axios from "@/utils/axios"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IAvailabeUser } from "@/types/chat.types"
import { getSignedUrlApi } from "@/services/common/post.services"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import socket from "@/sockets"
import { SOCKET_EVENTS } from "@/constants"

interface MenuListModalProps {
  setShowMenuListModal: (show: boolean) => void
  userId: string;
  orgId:string;
  userName:string;
  profile:string;
}


export const MenuListModal = ({ setShowMenuListModal, userId ,orgId ,userName,profile }: MenuListModalProps) => {
  const [availableUsers, setAvailableUsers] = useState<IAvailabeUser[]>([])


  const fetchAvailableUsers = async () => {
    const res = await axios.get("/api/agency/users");
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

  const handleCreateChat = async(targetUserId:string,targetUserName:string,targetUserProfile:string) =>{
    try {
      socket.emit(
        SOCKET_EVENTS.CHAT.CREATE_CHAT,
        ({
          userId,
          targetUserId,
          orgId,
          userName,
          targetUserName,
          targetUserProfile,
          userProfile:profile
        }))

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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

