import { useEffect, useState } from "react"
import { Plus, Trash2, UserCircle } from "lucide-react"
import axios from "@/utils/axios"
import { message } from "antd"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MenuListModalProps {
  setShowMenuListModal: (show: boolean) => void
  userId: string;
  role: string;
  orgId:string;
  userName:string;
  socket:any;
}

export const MenuListModal = ({ setShowMenuListModal, userId, role ,orgId ,userName , socket}: MenuListModalProps) => {
  const [groupName, setGroupName] = useState("")
  const [availableUsers, setAvailableUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<typeof availableUsers>([])

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedMembers.some((member) => member._id === user._id),
  )

  const fetchAvailableUsers = async () => {
    const res = await axios.get("/api/agency/availabe-users")
    console.log(res.data.users)
    setAvailableUsers(res.data.users || [])
  }

  useEffect(() => {
    fetchAvailableUsers()
  }, [])

  const addMember = (user: (typeof availableUsers)[0]) => {
    setSelectedMembers([...selectedMembers, user])
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const removeMember = (userId: number) => {
    setSelectedMembers(selectedMembers.filter((member) => member._id !== userId))
  }

  const handleCreateGroup = async () => {
    try {
      const details = {
        members: [...selectedMembers, { _id: userId, name: userName, type: role }],
        groupName,
      }
      const res = await axios.post("/api/entities/create-group", { details, userId })
      if(res){
        socket.current.emit("create-group",({group:res.data.group}))
      }
      setShowMenuListModal(false)
    } catch (error: any) {
      message.error(error.response.data.error || "")
    }
  }

  const handleCreateChat = async(targetUserId:string,targetUserName:string) =>{
    try {
 
      socket.current.emit("create-chat",({userId,targetUserId,orgId,userName,targetUserName}))
      
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
                {availableUsers.map((user:any) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={()=>handleCreateChat(user._id,user.name)}
                  >
                    <UserCircle className="text-slate-400" size={24} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{}</p>
                    </div>
                  </div>
                ))}
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
                            filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => addMember(user)}
                              >
                                <div className="font-medium">{user.name}</div>
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
                              <Button variant="ghost" size="icon" onClick={() => removeMember(member._id)}>
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

