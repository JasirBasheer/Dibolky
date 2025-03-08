import React, { useEffect, useRef, useState } from 'react';
import { Search, Users, Briefcase, Plus } from 'lucide-react';
import ChatInterface from '@/components/agency.components/agencyside.components/chat.interface';
import createSocketConnection from '@/utils/socket';
import { MenuListModal } from '@/components/common.components/chat-menu-list.modal';
import newMessageNotification from '../../assets/audios/notification-2-269292.mp3'
import { ChatItemProps, IChat, ISocketRef, Participant } from '@/types/chat.types';
import { Socket } from 'socket.io-client';
import { fetchAllChatsApi } from '@/services/common/get.services';
import { IMessage } from '@/types/chat.types';
import { CustomTabs, CustomTabsContent, CustomTabsList, CustomTabsTrigger } from '@/components/ui/customtab';
import { getSignedUrlApi } from '@/services/common/post.services';
import { ReduxIUser } from '@/types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const ChatItem: React.FC<ChatItemProps> = ({ name, active, onClick, isGroup = false, messages, userId, socket, chat_id, isMemberActive = false, activeMemberCount = 0, participants }) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  const [profileUrl, setProfileUrl] = useState<string>("")

  useEffect(() => {
    if (isGroup) return;

    const foundMember = participants?.find((item) => item.userId !== userId);
    if (!foundMember?.userId) return;

    const getProfileUrl = async () => {
      try {
        const response = await getSignedUrlApi(foundMember.profile as string);
        setProfileUrl(response.data.signedUrl || "");
      } catch (error) {
        console.error("Failed to fetch profile URL:", error);
      }
    };

    getProfileUrl();

    return () => {
      setProfileUrl("");
    };
  }, [participants]);


  useEffect(() => {
    const unreadCount = Array.isArray(messages)
      ? messages.reduce((acc, message) => {
        if (message.senderId != userId && !message.seen.some(seen => seen.userId == userId)) {
          acc += 1;
        }
        return acc;
      }, 0) : 0;

    setUnreadMessageCount(unreadCount);
  }, [messages, userId]);

  useEffect(() => {
    if (!socket?.current || !userId) return;

    const socketInstance = socket.current;
    const handleSeen = ({ chatId }: { chatId: string }) => {
      if (chatId === chat_id && active) {
        setUnreadMessageCount(0);
      }
    };

    socketInstance.on("seen", handleSeen);
    return () => {
      socketInstance.off("seen", handleSeen);
    };
  }, [socket, userId, chat_id, active]);


  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${active ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
    >
      <div className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center overflow-hidden">
        {isGroup ? (
          <div className="relative">
            <Briefcase className="text-slate-400" size={20} />
            {activeMemberCount > 0 && (
              <div className="absolute -bottom-1 -right-1 z-50 w-4 h-4 flex items-center justify-center bg-green-600 border-2 text-white rounded-full"><p className='text-[0.6rem] font-extrabold'>{activeMemberCount}</p></div>
            )}
          </div>
        ) : (
          <div className="relative">
            <Avatar className="h-16 w-16 border-4 border-background">
              <AvatarImage src={String(profileUrl as string)}
                className="h-full w-full object-cover"
                alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            {isMemberActive && (
              <div className="absolute bottom-4 right-3 z-50 w-3 h-3 bg-green-600 border-2 border-white rounded-full"></div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium truncate text-black`}>
            {name}
          </h3>
          {!active && unreadMessageCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
              {unreadMessageCount}
            </span>
          )}
        </div>


        <p className="text-xs text-slate-400 truncate">
          {messages && messages[messages.length - 1]?.senderName
            ? `${messages[messages.length - 1].senderName?.charAt(0).toUpperCase() + messages[messages.length - 1].senderName!.slice(1)} : ${messages[messages.length - 1].type == "deleted" ? "message deleted" : messages[messages.length - 1].text}`
            : "Start a new chat"}
        </p>
      </div>
    </div>
  )
}

const Chat: React.FC<{ user: ReduxIUser, isAdmin?: boolean }> = ({ user, isAdmin }) => {
  const [activeMembers, setActiveMembers] = useState<string[]>([])
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chats, setChats] = useState<IChat[]>([]);
  const socket = useRef<Socket | null>(null);
  const [showMenuListModal, setShowMenuListModal] = useState(false);
  const initialFetchDone = useRef<boolean>(false);
  const [sortedChats, setSortedChats] = useState<{ groups: IChat[], individualChats: IChat[] }>({ groups: [], individualChats: [] });



  useEffect(() => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id !== selectedChat) return chat;

        const finalMessages = chat?.messages?.map((msg) => {
          if (msg.chatId == selectedChat && !msg.seen.some((item) => item.userId == user.user_id)) {
            return {
              ...msg,
              seen: [
                ...(msg.seen ?? []),
                { userId: user.user_id, userName: user.name, seenAt: Date.now() },
              ],
            };
          }
          return msg;
        });

        return {
          ...chat,
          messages: finalMessages,
        };
      })
    )

    return () =>{
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id !== selectedChat) return chat;
  
          const finalMessages = chat?.messages?.map((msg) => {
            if (msg.chatId == selectedChat && !msg.seen.some((item) => item.userId == user.user_id)) {
              return {
                ...msg,
                seen: [
                  ...(msg.seen ?? []),
                  { userId: user.user_id, userName: user.name, seenAt: Date.now() },
                ],
              };
            }
            return msg;
          });
  
          return {
            ...chat,
            messages: finalMessages,
          };
        })
      )
  
    }
  }, [selectedChat])



  const fetchAllChats = async () => {
    if (!user.user_id) return;
    try {
      const response = await fetchAllChatsApi(user.user_id)
      const formattedChats = response.data.chats?.map((chat: IChat) => {
        if (chat.participants!.length < 3) {
          const otherUser = chat.participants!.find(p => p.userId !== user.user_id);
          return otherUser ? { ...chat, name: otherUser.name } : chat;
        }
        return chat;
      }) || [];

      setChats(formattedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    if (!user.orgId || !user.user_id) return;

    const newSocket = createSocketConnection();
    socket.current = newSocket;
    socket.current.emit('set-up', { orgId: user.orgId, userId: user.user_id });

    const handleNewMessage = ({ newMessage, chat_id, participants }: { newMessage: IMessage, chat_id: string, participants: Participant[] }) => {

      const isParticipant = participants.some((p: Participant) => p.userId == user.user_id);
      if (!isParticipant) return;

      if (newMessage.senderId !== user.user_id) {
        new Audio(newMessageNotification).play();
      }

      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id !== chat_id) return chat;
          const updatedMessages = [...(chat.messages ?? []), newMessage];
          return {
            ...chat,
            lastMessage: newMessage,
            messages: updatedMessages.map((msg: IMessage) => {
              if (msg.chatId == selectedChat && !msg.seen.some((item) => item.userId == user.user_id)) {

                return {
                  ...msg,
                  seen: [
                    ...(msg.seen ?? []),
                    { userId: user.user_id, userName: user?.name || "", seenAt: Date.now() },
                  ],
                };
              }
              return msg;
            }),
          };
        })
      })
    };




    const handleNewChat = ({ newChat }: { newChat: IChat }) => {
      const isParticipant = newChat.participants!.some((p: Participant) => p.userId === user.user_id);
      if (!isParticipant) return;

      new Audio(newMessageNotification).play()
      setShowMenuListModal(false)
      setSelectedChat(newChat._id as string)

      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === newChat._id);
        if (chatExists) return prevChats;

        const formattedChat = {
          ...newChat,
          name: newChat.participants!.length < 3
            ? newChat.participants?.find((p: Participant) => p.userId !== user.user_id)?.name
            : newChat.name
        };

        return [...prevChats, formattedChat];
      });
    };


    const handleOnGroupCreated = ({ group }: { group: IChat }) => {
      const isParticipant = group?.participants?.some(
        (participant: Participant) => participant.userId == user.user_id
      );
      if (isParticipant) {
        new Audio(newMessageNotification).play()
        setChats(prev => [...prev, group])
      }
    };

    const handleAcitiveMembers = ({ users }: { users: string[] }) => {
      setActiveMembers(users)
    }

    const handleRemovedMember = ({ chatId, memberId }: { chatId: string, memberId: string }) => {
      if (user.user_id != memberId) return
      if (selectedChat == chatId) setSelectedChat("")
      setChats((prev) => prev.filter((chat) => chat._id != chatId))
    }

    const handleDeletedMessage = ({ chatId, messageId }: { chatId: string, messageId: string }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id !== chatId
            ? chat : chat.messages && chat.messages.length > 0 ?
              { ...chat, messages: chat.messages.map((msg) => msg._id === messageId ? { ...msg, text: "", type: "deleted" } : msg) }
              : chat
        )
      );

    }


    socket.current.on('new-message-received', handleNewMessage);
    socket.current.on('new-chat-created', handleNewChat);
    socket.current.on('group-created', handleOnGroupCreated);
    socket.current.on("active-users", handleAcitiveMembers);
    socket.current.on("member-removed", handleRemovedMember);
    socket.current.on("message-deleted", handleDeletedMessage);


    return () => {
      socket.current?.emit('set-member-offline', { userId: user.user_id, orgId: user.orgId })
      socket?.current?.off('new-message-received', handleNewMessage);
      socket?.current?.off('new-chat-created', handleNewChat);
      socket?.current?.off('group-created', handleOnGroupCreated);
      socket?.current?.off('active-users', handleAcitiveMembers);
      socket?.current?.disconnect()
    };
  }, [user.orgId, user.user_id]);


  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchAllChats();
      initialFetchDone.current = true;
    }
  }, [user.user_id]);

  useEffect(() => {
    const filteredChats = chats.filter(chat =>
      chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unSortedGroups = filteredChats.filter(chat => chat.participants!.length > 2);
    const unSortedIndividualChats = filteredChats.filter(chat => chat.participants!.length <= 2);

    const sortByLastMessageTime = (a: IChat, b: IChat) => {
      const getLastMessageTime = (chat: IChat) => {
        const lastMessage = chat.messages?.[chat.messages.length - 1];
        return lastMessage?.createdAt ? new Date(lastMessage.createdAt).getTime() : 0;
      };

      return getLastMessageTime(b) - getLastMessageTime(a);
    };

    setSortedChats({
      groups: [...unSortedGroups].sort(sortByLastMessageTime),
      individualChats: [...unSortedIndividualChats].sort(sortByLastMessageTime),
    });
  }, [chats, searchTerm]);



  return (
    <div className="w-full flex flex-wrap min-h-screen bg-slate-100  rounded-3xl">
      <div className={`md:w-1/3 w-full md:h-[40rem] h-screen overflow-y-auto md:border-r-2 pb-20 border-[#cbcbcb32] p-6 ${selectedChat !== "" ? "hidden md:block md:flex-wrap" : ""}`}>
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowMenuListModal(true)}
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        <CustomTabs defaultValue="chats" className="w-full">
          <CustomTabsList>
            {/* <CustomTabsTrigger value="all">All</CustomTabsTrigger>
            <CustomTabsTrigger value="mentions">@ Mentions</CustomTabsTrigger> */}
            <CustomTabsTrigger value="chats">Chats</CustomTabsTrigger>
            <CustomTabsTrigger value="groups">Groups</CustomTabsTrigger>
          </CustomTabsList>
          <CustomTabsContent value="chats">
            {sortedChats.individualChats.length > 0 && (
              <div className="space-y-6">
                <div>
                  <div className="space-y-2">
                    {sortedChats.individualChats.map((chat) => {
                      const member = chat?.participants?.find((item: Participant) => item.userId !== user.user_id);
                      const memberId = member ? member.userId : null;
                      const isMemberActive = activeMembers?.includes(memberId as string)

                      return (
                        <ChatItem
                          key={chat._id}
                          name={chat.name as string}
                          active={selectedChat === chat._id}
                          onClick={() => setSelectedChat(chat._id as string)}
                          isGroup={false}
                          messages={chat.messages!}
                          userId={user.user_id}
                          socket={socket as ISocketRef}
                          chat_id={chat._id as string}
                          isMemberActive={isMemberActive}
                          participants={chat.participants}
                        />
                      );
                    })}

                  </div>
                </div>
              </div>
            )}
          </CustomTabsContent>
          <CustomTabsContent value="groups">
            {sortedChats.groups.length > 0 && (
              <div className="space-y-6">
                <div>

                  <div className="space-y-2">
                    {sortedChats.groups.map((chat) => {
                      const activeMemberCount = chat?.participants?.filter((item: Participant) =>
                        activeMembers?.includes(item.userId!) && item.userId != user.user_id
                      ).length || 0;

                      return (
                        <ChatItem
                          key={chat._id}
                          name={chat.name!}
                          active={selectedChat === chat._id}
                          onClick={() => setSelectedChat(chat._id as string)}
                          isGroup={true}
                          messages={chat.messages!}
                          userId={user.user_id}
                          socket={socket as ISocketRef}
                          chat_id={chat._id as string}
                          activeMemberCount={activeMemberCount}
                        />
                      );
                    })}


                  </div>
                </div>
              </div>
            )}
          </CustomTabsContent>
        </CustomTabs>

      </div>

      {showMenuListModal && (
        <MenuListModal setShowMenuListModal={setShowMenuListModal} userId={user.user_id} role='admin' orgId={user.orgId} userName={user?.organizationName || user.name} profile={user?.profile} />
      )}

      <div className="md:w-2/3 w-full md:flex flex bg-slate-100 relative">
        {selectedChat ? (
          <ChatInterface
            userId={user.user_id}
            orgId={user.orgId}
            chatId={selectedChat}
            socket={socket as ISocketRef}
            userName={user.name ?? user.organizationName}
            onChatClose={() => setSelectedChat("")} 
            />
        ) : (
          <div className=" sm:flex hidden absolute inset-0 flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-4 mx-auto">
                <Users className="text-slate-600" size={40} />
              </div>
              <h1 className="text-xl font-medium text-slate-700">Select a conversation</h1>
              <p className="text-slate-600 mt-2">Choose from your existing chats</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;