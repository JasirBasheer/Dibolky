import axios from '@/utils/axios';
import createSocketConnection from '@/utils/socket';
import { formatDate } from '@/utils/utils';
import { Crown, MoreVertical, Paperclip, Plus, Search, Send, UserCircle, UserMinus, UserPlus, Users } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IMessage, IParticipant } from '@/types/common.types';
import { Socket } from 'socket.io-client';
import { IChat } from '@/types/chat.types';




const ChatInterface = ({ userId, orgId, chatId, userName }: { userId: string, orgId: string, chatId: string, userName: string }) => {
  const [messages, setMessage] = useState<IMessage[]>([])
  const [newMessage, setNewMessage] = useState<IMessage>({ text: "" })
  const socket = useRef<Socket | null>(null);
  const [showChatDetails, setShowChatDetails] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [chatDetails, setChatDetails] = useState<IChat>({})

  const fetchRecentMessages = async () => {
    try {
      const res = await axios.post(`/api/entities/chats`, { chatId })
      console.log(res.data);

      setMessage([...res.data.chats.messages])
      const { messages, ...details } = res.data.chats
      setChatDetails(details)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!userId) return
    const newSocket = createSocketConnection();
    socket.current = newSocket;
    socket.current.emit('set-up', { orgId, userId })

    socket.current.on('new-message-received', ({ newMessage, chat_id, participants }) => {
      const isParticipant = participants.some((item: { userId: string }) => item.userId == userId)
      if (isParticipant && chatId == chat_id) {
        setMessage((prev: IMessage[]) => [...prev, newMessage])
      }
    })


    return () => {
      socket?.current?.disconnect()
    }
  }, [userId, chatId, orgId])

  useEffect(() => {
    fetchRecentMessages()
  }, [userId, chatId, orgId])

  const handleChange = (value: string, key: string) => {
    setNewMessage((prev) => ({
      ...prev,
      [key]: value
    }));
  };


  const handleSendMessage = () => {
    if (!newMessage?.text?.trim()) return;

    const message = { text: newMessage.text, type: "text" };
    socket?.current?.emit("send-message", { orgId, chatId, userId, userName, message });
    setNewMessage({ text: "" });
  }
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleAddMember = async (targetUserId: string, targetUsername: string, targetType: string) => {
    try {
      if (!chatId || !orgId || !userName) {
        console.error("Missing required data for adding member:", { chatId, orgId, userName });
        return;
      }

      const socket = createSocketConnection();
      socket.emit('set-up', { orgId, userId })

      console.log({ chatId, orgId, userId: targetUserId, userName: targetUsername, type: targetType, admin: userName })
      socket.emit('add-member', ({ chatId, orgId, userId: targetUserId, userName: targetUsername, type: targetType, admin: userName }))
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="flex flex-col h-[40rem] w-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
            <Users className="text-slate-600" size={20} onClick={() => setShowChatDetails(true)} />
          </div>
          <div>
            <h2 className="font-medium text-slate-800">
              {chatDetails.name ||
                chatDetails.participants?.find(
                  (item) => item.userId && item.userId !== userId
                )?.name ||
                "Unknown"}
            </h2>

            <p className="text-sm text-slate-500"></p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-200 rounded-full">
          <MoreVertical size={20} className="text-slate-600" />
        </button>
      </div>

      <div ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg: IMessage, index: React.Key | null | undefined) => {
          return (
            msg.type === 'common' ? (
              <div key={index} className="flex items-center justify-center p-2">
                <span className="text-xs text-slate-500">{msg.text}</span>
              </div>
            ) : msg.senderId === userId ? (
              <div key={index} className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="text-white" size={18} />
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-blue-600 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <span className="font-normal text-sm text-slate-200">You</span>
                    </div>
                    <p className="text-white">{msg.text}</p>
                    <span className="text-xs text-blue-200">{formatDate(msg?.createdAt as string)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={index} className="flex items-start gap-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="text-blue-600" size={18} />
                </div>
                <div className="flex flex-col">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-normal text-sm text-slate-400">
                        {msg.senderName ? msg.senderName.charAt(0).toUpperCase() + msg.senderName.slice(1) : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-slate-800">{msg.text}</p>
                    <span className="text-xs text-slate-400">{formatDate(msg?.createdAt as string)}</span>
                  </div>
                </div>
              </div>
            )
          )

        })}

      </div>
      {showChatDetails && <ChatDetails setShowChatDetails={setShowChatDetails} details={chatDetails} userId={userId} onAddMember={handleAddMember} orgId={orgId} />}


      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Paperclip size={20} className="text-slate-600" />
          </button>
          <input
            type="text"
            value={newMessage.text}
            onChange={(e) => handleChange(e.target.value, 'text')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 outline-none px-2"
          />
          <button onClick={handleSendMessage}

            className="p-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-full">
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface















interface ChatDetailsProps {
  setShowChatDetails: (arg0: boolean) => void;
  details: IChat;
  userId: string;
  onAddMember: (targetUserId: string, targetUsername: string, targetType: string) => void;
  orgId: string
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ setShowChatDetails, details, userId, onAddMember, orgId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedMembers, setSuggestedMembers] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[]>(details.participants || [])
  const [filteredSuggestions, setFilteredSuggestions] = useState<{ _id: string, name: string, type: string, }[]>([])
  const user = currentParticipants.find((item: { userId: string; }) => item.userId == userId)
  
  const fetchAvailableUsers = async () => {
    const res = await axios.get("/api/agency/availabe-users")
    console.log(res.data);
    setSuggestedMembers(res.data.users || [])
  }

  useEffect(() => {
    fetchAvailableUsers()
  }, [])

  useEffect(() => {

    const socket = createSocketConnection();
    socket.emit('set-up', { orgId, userId })

    socket.on('new-member-added', ({ member }) => {
      const isParticipant = details?.participants?.some((item: { userId?: string }) => item.userId !== undefined && item.userId === userId);
      if (isParticipant) setCurrentParticipants((prev: IParticipant[]) => [...prev, member])
    })


    return () => {
      socket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    if (suggestedMembers.length == 0) return
    const members = suggestedMembers.filter((member: { _id: string }) => !currentParticipants.some((p: { userId: string; }) => p.userId === member?._id)).filter((member: { name: string }) => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredSuggestions(members)
    fetchAvailableUsers()
  }, [suggestedMembers, currentParticipants])

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };



  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setShowChatDetails(false)}
    >
      <Card className="w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6 flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="about" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about" className="flex items-center gap-2">
                <UserCircle size={16} />
                About
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Plus size={16} />
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="flex-1 overflow-auto">
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Group Details</h3>
                  <p className="text-sm text-gray-500">Name: {details.name}</p>
                </div>
              </div>
              <h3 className="text-lg font-medium mt-4">Current Members</h3>

              <ScrollArea className="h-64 w-full rounded-md border">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Participants ({currentParticipants.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {currentParticipants.map((participant: IParticipant) => (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-primary/10">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                            {/* {participant.avatarUrl && <AvatarImage src={participant.avatarUrl} />} */}
                          </Avatar>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium leading-none">{participant.name}</p>
                              {participant.type === "admin" && (
                                <Crown className="h-3 w-3 mr-1 text-amber-500" />
                              )}
                            </div>
                            {participant.userId === user?.userId && (
                              <p className="text-xs text-muted-foreground">
                                You
                              </p>
                            )}
                          </div>
                        </div>

                        {user?.type === "admin" && participant.userId !== user.userId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {participant.type === "admin" ? (
                                <DropdownMenuItem
                                  // onClick={() => onDemoteAdmin(participant.userId)}
                                  className="text-amber-600 focus:text-amber-600"
                                >
                                  <Crown className="h-4 w-4 mr-2 rotate-180" />
                                  Demote from admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  // onClick={() => onMakeAdmin(participant.userId)}
                                  className="text-amber-600 focus:text-amber-600"
                                >
                                  <Crown className="h-4 w-4 mr-2" />
                                  Make admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                // onClick={() => onRemoveMember(participant.userId)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove participant
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="members" className="flex-1 overflow-hidden flex flex-col">
              <div className="mt-6 space-y-4 flex-1 overflow-hidden flex flex-col">
                <div className="pt-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <UserPlus size={18} />
                    Add Members
                  </h3>

                  <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <ScrollArea className="h-48 mt-2 border rounded-md p-2">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((member: { _id: string, name: string, type: string, }) => (
                        <div key={member._id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{member.type}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onAddMember(member?._id, member?.name, member?.type)}
                            className="h-8"
                          >
                            Add
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 p-2">No users found</p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

