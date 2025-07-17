import React, { useEffect, useRef, useState } from 'react'
import createSocketConnection from '@/utils/socket';
import axios from '@/utils/axios';
import { formatDate, formatDateTime } from '@/utils/utils';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IMessage, IParticipant, RootState } from '@/types/common.types';
import { EmojiClickData, IAvailabeUser, IChat, ISocketRef } from '@/types/chat.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Crown, LucideCheckCheck, MoreVertical,
  Paperclip, Plus,
  Search, Send,
  Smile,
  Trash,
  UserCircle, UserMinus,
  UserPlus,
  Users,
  X
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { fetchChatsApi, getSignedUrlApi } from '@/services/common/post.services';
import { Separator } from '@radix-ui/react-select';
import Skeleton from 'react-loading-skeleton';
import MediaDisplay from '@/components/common.components/media-display';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { fetchAvailableUsersApi } from '@/services/agency/get.services';



const ChatInterface = ({ userId, orgId, chatId, socket, userName, onChatClose }: { userId: string, orgId: string, chatId: string, socket: ISocketRef, userName: string,onChatClose: () => void}) => {
  const user = useSelector((state: RootState) => state.user)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [newMessage, setNewMessage] = useState<{ text: string; file: File | null; contentType: string | null }>({ text: "", file: null, contentType: null })
  const [showChatDetails, setShowChatDetails] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [chatDetails, setChatDetails] = useState<IChat>({ _id: "" });
  const [showDeleteMessage, setShowDeleteMessage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [participantsWithProfiles, setParticipantsWithProfiles] = useState<IParticipant[]>([]);
  const [isMessageSending, setIsMessageSending] = useState<boolean>(false)
  const [isDeleting,setIsDeleting] = useState<boolean>(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const handleMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUploadClick = async (files: File[]) => {
    const file = files[0]
    const fileName = file?.name;
    const fileExtension = fileName?.split(".").pop()?.toLowerCase()
    const isSupported = (["jpeg", "png"].includes(fileExtension || "") || ["mov", "mp4"].includes(fileExtension || ""));
    const fileSizeMB = file.size / (1024 * 1024);
    const maxSizeMB = 10;

    if (!isSupported) {
      message.error("Only videos and images are supported")
      return
    }

    if (fileSizeMB > maxSizeMB) {
      message.error(`File size should not exceed ${maxSizeMB} MB`);
      return;
    }

    setNewMessage((prev) => ({
      ...prev,
      file: file,
      contentType: ["jpeg", "png"].includes(fileExtension || "") ? "image" : "video" as string
    }));

  }

  const fetchRecentMessages = async () => {
    try {
      if (!socket || !socket.current) return;
      socket.current.emit("set-seen", { orgId, chatId, userId, userName });

      const res = await fetchChatsApi(chatId)

      const messages = res.data.chats.messages || [];
      const { message, ...details } = res.data.chats;
      setChatDetails(details);

      const updatedMessages = await Promise.all(
        messages.map(async (msg: IMessage) => {
          if (msg.key) {
            const signedUrlRes = await getSignedUrlApi(msg.key)
            return { ...msg, key: signedUrlRes.data.signedUrl };
          }
          return msg;
        })
      );

      setMessages(updatedMessages);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!chatDetails?.participants || chatDetails.participants.length === 0) return;

      try {
        const updatedParticipants = await Promise.all(
          chatDetails.participants.map(async (participant) => {
            try {
              const url = await getSignedUrlApi(String(participant.profile) || "");
              return { ...participant, profileUrl: url.data.signedUrl || "" };
            } catch (error) {
              console.error(`Failed to fetch URL for ${participant.name}:`, error);
              return { ...participant, profileUrl: "" };
            }
          })
        );

        setParticipantsWithProfiles(updatedParticipants);
      } catch (error) {
        console.error("Failed to fetch signed URLs:", error);
      }
    };

    if (chatDetails._id) {
      fetchSignedUrls();
    }

    const socketInstance = socket.current;

    return () => {
      socketInstance.emit("set-seen", { orgId, chatId, userId, userName });
    };
  }, [chatDetails._id]);



  useEffect(() => {
    if (!userId || !socket?.current || !chatId) return;

    const socketInstance = socket.current;

    const handleNewMessage = async ({
      newMessage,
      chat_id,
      participants,
    }: {
      newMessage: IMessage;
      chat_id: string;
      participants: { userId: string }[];
    }) => {
      try {
        const isParticipant = participants.some((item) => item.userId === userId);
        if (isParticipant && chatId === chat_id) {
          if (newMessage.key && newMessage.key !== "") {
            let url = newMessage.key;
            try {
              const response = await getSignedUrlApi(url);
              url = response?.data?.signedUrl || url;
              newMessage.key = url;
            } catch (error) {
              console.error("Error fetching signed URL:", error);
              newMessage.key = "";
            }
          }
          setMessages((prev: IMessage[]) => [...prev, newMessage]);
        }
      } catch (error) {
        console.error("Error in handleNewMessage:", error);
      }
    };


    const handleDeletedMessage = ({ chatId, messageId }: { chatId: string, messageId: string }) => {
      setMessages((prev) => {
        return prev.map((item) => {
          if (item._id == messageId) {
            return {
              ...item,
              text: "",
              fileUrl: "",
              type: "deleted"
            };
          }
          return item;
        });
      });
    };

    socketInstance.on("new-message-received", handleNewMessage);
    socketInstance.on("message-deleted", handleDeletedMessage);

    return () => {
      socketInstance.emit("set-seen", { orgId, chatId, userId, userName });
      socketInstance.off("new-message-received", handleNewMessage);
    };
  }, [userId, chatId]);


  useEffect(() => {
    if (chatId) {
      fetchRecentMessages()
    }
  }, [chatId])


  const handleChange = (value: string, key: string) => {
    setNewMessage((prev) => ({
      ...prev,
      [key]: value
    }));
  };


  const handleSendMessage = async () => {
    try {
      setIsMessageSending(true)
      let file = null

      if (!newMessage?.text?.trim() && !newMessage?.file){
      setIsMessageSending(false)
        return;
      } 
      if (newMessage.file != null) {
        const fileData = {
          fileName: newMessage?.file?.name,
          fileType: newMessage?.file?.type,
          fileSize: newMessage?.file?.size
        }
        const response = await axios.post('/api/entities/get-s3Upload-url', { file: fileData })
        file = response?.data?.s3file

        await axios.put(file.url, newMessage?.file, {
          headers: {
            'Content-Type': file?.contentType,
            'Content-Disposition': 'inline',
          },
        });
      }


      const message = { text: newMessage.text, type: "text", key: file?.key ?? null, contentType: newMessage.contentType ?? null };
      socket?.current?.emit("send-message", { orgId, chatId, userId, userName, profile: user.profile, message });
      setNewMessage({ text: "", file: null, contentType: null });
      setIsMessageSending(false)

    } catch (error) {
      setIsMessageSending(false)
      message.error("An unexpected error occured while sending message")
      console.log(error)
    }
  }

  const handleDeleteMesage = (chatId: string, messageId: string) => {
    if (!messageId || !socket) return
    setIsDeleting(true)
    socket.current.emit('delete-message', { orgId, chatId, messageId  })
    setShowDeleteMessage("")
    setIsDeleting(false)
  }

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleAddMember = async (targetUserId: string, targetUsername: string, targetType: string, targetUserProfile: string) => {
    try {
      if (!chatId || !orgId || !userName) {
        console.error("Missing required data for adding member:", { chatId, orgId, userName });
        return;
      }

      const socket = createSocketConnection();
      socket.emit('set-up', { orgId, userId })

      console.log({ chatId, orgId, userId: targetUserId, userName: targetUsername, type: targetType, admin: userName })
      socket.emit('add-member', ({ chatId, orgId, userId: targetUserId, userName: targetUsername, type: targetType, admin: userName, targetUserProfile }))
    } catch (error) {
      console.log(error);
    }
  }

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    console.log(emojiData)
    setNewMessage((prev) => ({ ...prev, text: prev.text + emojiData.native }));
    setShowEmojiPicker(false);
  };


  return (
    <div className="flex flex-col h-[40rem] w-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <ChevronLeft onClick={onChatClose} className='cursor-pointer'/>
          {chatDetails.participants && chatDetails?.participants?.length < 3 ? (
            <Avatar className="w-10 h-10 rounded-full overflow-hidden flex items-center bg-slate-500   justify-center" onClick={() => setShowChatDetails(true)} >
              <AvatarImage
                src={participantsWithProfiles?.find((item) => item.userId != userId)?.profileUrl}
                className="h-full w-full object-cover"
                alt={participantsWithProfiles?.find((item) => item.userId != userId)?.name || "Unknown"}
              />
              <AvatarFallback className="bg-primary/10">
                {(participantsWithProfiles?.find((item) => item.userId != userId)?.name)?.charAt(0)}
              </AvatarFallback>
            </Avatar>

          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
              <Users className="text-slate-600" size={20} onClick={() => setShowChatDetails(true)} />
            </div>
          )}
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
      </div>

      <div ref={messageContainerRef}
        className="flex-1 overflow-y-auto">
        {messages.map((msg: IMessage, index: React.Key | null | undefined) => {
          const seenMembers = msg.seen?.filter((item) => item.userId != userId) ?? []
          return (
            msg.type === 'common' ? (
              <div key={index} className="flex items-center justify-center p-2">
                <span className="text-xs text-slate-500">{msg.text}</span>
              </div>
            ) : msg.type === 'deleted' ? (
              <div className="flex items-center justify-center py-2 px-4">
                <div className="flex items-center gap-2 py-1 px-3 bg-slate-100 rounded-md text-slate-500 text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  <span>This message was deleted by {msg.senderName}</span>
                </div>
              </div>
            ) : msg.senderId === userId ? (

              <div key={index} className="flex items-start max-w-full bg-[#c3bdbd1c] px-7"
                onClick={() => setShowDeleteMessage("")}
              >

                <Avatar className="w-10 h-10 rounded-md overflow-hidden flex items-center bg-slate-500 mt-4  justify-center">
                  <AvatarImage
                    src={participantsWithProfiles?.find((item) => item.userId == msg.senderId)?.profileUrl}
                    className="h-full w-full object-cover"
                    alt={participantsWithProfiles?.find((item) => item.userId == msg.senderId)?.name || "Unknown"}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {(participantsWithProfiles?.find((item) => item.userId == msg.senderId)?.name)?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="rounded-lg p-4 relative "
                    onClick={(e) => e.stopPropagation()}>


                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <span className="font-normal text-sm text-grey-00">You</span>
                      <span className="text-[0.6rem] mt-1">{formatDateTime(msg?.createdAt as string)}</span>

                      <div className="relative group">
                        <button className="text-black p-1 "
                          onClick={() => setShowDeleteMessage((prev) => prev == "" ? msg._id as string : "")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                        <div className={`absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 ${showDeleteMessage == msg._id ? "block" : "hidden"}`}
                        >
                          {isDeleting?(
                            <Skeleton width={100} height={14}/>
                          ):(
                            <button
                            onClick={() => handleDeleteMesage(msg.chatId as string, msg._id as string)}
                            className="px-1 py-1 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                          >
                            <Trash width={15} />
                            Delete message
                          </button>
                          )}
                         
                        </div>
                      </div>

                    </div>
                    {(msg.contentType === "image" || msg.contentType === "video") && (
                     <MediaDisplay url={msg.key as string} contentType={msg.contentType} />
                    )}

                    <p className="text-black">{msg.text}</p>


                    <LucideCheckCheck width={12} color={`${seenMembers?.length == 0 ? "grey" : "blue"}`} />
                  </div>
                  <div className="flex items-center gap-1 justify-evenly">
                  </div>
                </div>
              </div>
            ) : (
              <div key={index} className="flex items-start max-w-full bg-[#ffffffe0] px-7 py-2">
                <Avatar className="w-10 h-10 rounded-md overflow-hidden flex items-center bg-slate-500 mt-4  justify-center">
                  <AvatarImage
                    src={participantsWithProfiles?.find((item) => item.userId == msg.senderId)?.profileUrl}
                    className="h-full w-full object-cover"
                    alt={participantsWithProfiles?.find((item) => item.userId == msg.senderId)?.name || "Unknown"}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {(participantsWithProfiles?.find((item) => item.userId == msg.senderId)?.name)?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className=" rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-normal text-sm text-black">
                        {msg.senderName ? msg.senderName.charAt(0).toUpperCase() + msg.senderName.slice(1) : 'Unknown'}
                        <span className="text-[0.6rem] ml-2 text-black">{formatDateTime(msg?.createdAt as string)}</span>
                      </span>
                    </div>
                    {(msg.contentType === "image" || msg.contentType === "video") && (
                     <MediaDisplay url={msg.key as string} contentType={msg.contentType} />
                    )}
                    <p className="text-black">{msg.text}</p>
                  </div>
                </div>
              </div>
            )
          )
        })}

      </div>
      {showChatDetails && <ChatDetails setShowChatDetails={setShowChatDetails} details={chatDetails} userId={userId} onAddMember={handleAddMember} orgId={orgId} chatId={chatId} />}


      {showEmojiPicker && (
      <div className="absolute z-10 bottom-56">
        <Picker data={data} onEmojiSelect={handleEmojiSelect} />
      </div>
    )}
      <div className="p-4 border-t border-slate-200">
        {newMessage.file && (
          <div className="flex items-center mb-2 bg-slate-100 rounded-lg px-3 py-1 text-sm text-slate-700">
            <span className="truncate flex-1">
              {newMessage.file.name}
            </span>
            <button
              onClick={() => setNewMessage((prev) => ({
                ...prev,
                file: null
              }))}
              className="ml-2 p-1 hover:bg-slate-200 rounded-full"
              title="Clear file"
            >
              {isMessageSending ? (
                <Skeleton width={24} height={24} />
              ) : (
                <X size={16} className="text-slate-600" />
              )}

            </button>
          </div>
        )}

        <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <div>
            {isMessageSending ? (
              <Skeleton width={32} height={32} borderRadius={100} />
            ) : (
              <>
              <button
                className="p-2 hover:bg-slate-100 rounded-full"
                onClick={handleMediaClick}
              >
                <Paperclip size={20} className="text-slate-600" />
              </button>

              <button
                className="p-2 hover:bg-slate-100 rounded-full"
                onClick={() => setShowEmojiPicker((prev)=>!prev)}
              >
                <Smile size={20} className="text-slate-600" />
              </button>
                
                </>
            )}


            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              // onChange={(e) => handleFileUploadClick(e?.target?.files)}
            />
          </div>
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

          {isMessageSending ? (
            <Skeleton width={32} height={32} borderRadius={100} />
          ) : (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-full"
            >
              <Send size={20} className="text-white" />
            </button>
          )}

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
  onAddMember: (targetUserId: string, targetUsername: string, targetType: string, targetUserProfile: string) => void;
  orgId: string;
  chatId: string;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ setShowChatDetails, details, userId, onAddMember, orgId, chatId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedMembers, setSuggestedMembers] = useState<IAvailabeUser[]>([]);
  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[]>(details.participants || [])
  const [filteredSuggestions, setFilteredSuggestions] = useState<IAvailabeUser[]>([])
  const user = currentParticipants.find((item) => item.userId && item.userId === userId);



  useEffect(() => {
    const fetchSignedUrls = async () => {
      const updatedParticipants = await Promise.all(
        currentParticipants.map(async (item) => {
          try {
            const url = await getSignedUrlApi(String(item?.profile) || "");
            return {
              ...item,
              profileUrl: url.data.signedUrl || "",
            };
          } catch (error) {
            console.error("Failed to fetch profile URL for:", item?.userId, error);
            return {
              ...item,
              profileUrl: "",
            };
          }
        })
      );
      setCurrentParticipants(updatedParticipants);
      console.log("Updated Participants:", updatedParticipants);
    };

    fetchSignedUrls();
  }, [details]);



  const fetchAvailableUsers = async () => {
    const res = await fetchAvailableUsersApi()
    const users = res.data.users || []

    const updatedAvailableUsers: IAvailabeUser[] = await Promise.all(
      users.map(async (item: IAvailabeUser) => {
        try {
          const url = await getSignedUrlApi(String(item?.profile) || "");
          return {
            ...item,
            profileUrl: url.data.signedUrl || "",
          };
        } catch (error) {
          console.error("Failed to fetch profile URL for:", item?._id, error);
          return {
            ...item,
            profileUrl: "",
          };
        }
      })
    );
    setSuggestedMembers(updatedAvailableUsers)
    console.log(updatedAvailableUsers)
  }

  useEffect(() => {
    fetchAvailableUsers()
  }, [])

  useEffect(() => {

    const socket = createSocketConnection();
    socket.emit('set-up', { orgId, userId })

    socket.on('new-member-added', ({ member }) => {
      const isParticipant = details?.participants?.some((item: { userId?: string }) => item.userId !== undefined && item.userId === userId);
      if (isParticipant) fetchAvailableUsers()
    })


    return () => {
      socket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    if (suggestedMembers.length == 0) return
    const members = suggestedMembers
      .filter((member: { _id: string }) =>
        !currentParticipants.some((p: { userId?: string }) => p.userId == member?._id)
      )
      .filter((member: { name: string }) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredSuggestions(members);
  }, [suggestedMembers])

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const removeMember = (memberId: string) => {
    if (currentParticipants.length < 4) {
      message.error("A group needs 3 members atleast.")
      return
    }
    const socket = createSocketConnection();
    socket.emit('set-up', { orgId, userId })
    setCurrentParticipants((prev) => prev.filter((member: IParticipant) => member.userId !== undefined && member.userId != memberId));
    socket.emit('remove-member', { orgId, chatId, memberId })
  }

  const handleAddMember = (member_id: string, name: string, type: string, profile: string) => {
    setFilteredSuggestions((prev) => prev.filter((member) => member._id != member_id))
    setCurrentParticipants((prev) => [...prev, { userId: member_id, name, profile, type }]);
  }


  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setShowChatDetails(false)}
    >
      {currentParticipants && currentParticipants.length <= 2 ? (

        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-medium">User Details</CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage
                  src={String(currentParticipants?.find((member: IParticipant) => member.userId !== userId)?.profileUrl)}
                  className="h-full w-full object-cover"
                  alt={details?.participants?.find((member: IParticipant) => member.userId !== userId)?.name || "Unknown"}
                />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {(currentParticipants?.find((member: IParticipant) => member.userId !== userId)?.name || "Unknown").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-muted-foreground">Chated since</span>
                  <span className="font-medium">{formatDate(details.createdAt as string)}</span>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>


      ) : (

        <Card className="w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <CardContent className="p-6 flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="about" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <UserCircle size={16} />
                  About
                </TabsTrigger>
                {user?.type === "admin" && (
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Plus size={16} />
                  Members
                </TabsTrigger>

                ) }
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
                              <AvatarImage
                                src={participant.profileUrl}
                                className="h-full w-full object-cover"
                                alt={participant.name || "Unknown"}
                              />
                              <AvatarFallback className="bg-primary/10">
                                {getInitials(participant.name)}
                              </AvatarFallback>
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
                                <DropdownMenuItem
                                  onClick={() => removeMember(participant.userId as string)}
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
                        filteredSuggestions.map((member: IAvailabeUser) => (
                          <div key={member._id} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={member.profileUrl}
                                  className="h-full w-full object-cover"
                                  alt={member.name || "Unknown"}
                                />
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{member.type}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                onAddMember(member?._id, member?.name, member?.type, member?.profile)
                                handleAddMember(member?._id, member?.name, member?.type, member?.profile)
                              }}
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
      )}
    </div>
  );
};

