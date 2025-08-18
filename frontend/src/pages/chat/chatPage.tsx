import React, { useEffect, useRef, useState } from "react";
import { RootState } from "@/types";
import { useSelector } from "react-redux";
import { IChat, Participant } from "@/types/chat.types";
import { Socket } from "socket.io-client";
import { fetchAllChatsApi } from "@/services/common/get.services";
import { IMessage } from "@/types/chat.types";
import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/customtab";
import socket from "@/sockets";
import newMessageNotification from "../../assets/audios/notification-2-269292.mp3";
import { Plus, Search, Users } from "lucide-react";
import { ChatItem } from "./components/chatItem";
import { MenuListModal } from "./components/menuListModal";
import ChatInterface from "./components/chatInterface";
import { SOCKET_EVENTS } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";

const ChatPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [activeMembers, setActiveMembers] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chats, setChats] = useState<IChat[]>([]);
  const [showMenuListModal, setShowMenuListModal] = useState(false);
  const initialFetchDone = useRef<boolean>(false);
  const [sortedChats, setSortedChats] = useState<IChat[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);

  useEffect(() => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id !== selectedChat) return chat;

        const finalMessages = chat?.messages?.map((msg) => {
          if (
            msg.chatId == selectedChat &&
            !msg.seen.some((item) => item.userId == user.user_id)
          ) {
            return {
              ...msg,
              seen: [
                ...(msg.seen ?? []),
                {
                  userId: user.user_id,
                  userName: user.name,
                  seenAt: Date.now(),
                },
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

    );

    return () => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id !== selectedChat) return chat;

          const finalMessages = chat?.messages?.map((msg) => {
            if (
              msg.chatId == selectedChat &&
              !msg.seen.some((item) => item.userId == user.user_id)
            ) {
              return {
                ...msg,
                seen: [
                  ...(msg.seen ?? []),
                  {
                    userId: user.user_id,
                    userName: user.name,
                    seenAt: Date.now(),
                  },
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
      );
    };
  }, [selectedChat]);

  const fetchAllChats = async () => {
    if (!user.user_id) return;
    try {
      setIsMessagesLoading(true)
      const response = await fetchAllChatsApi(user.user_id);
      const formattedChats =
        response.data.chats?.map((chat: IChat) => {
          const otherUser = chat.participants!.find(
            (p) => p.userId !== user.user_id
          );
          return otherUser ? { ...chat, name: otherUser.name } : chat;
        }) || [];
      setChats(formattedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }finally{
      setIsMessagesLoading(false)
    }
  };

  useEffect(() => {
    if (!user.orgId || !user.user_id) return;

    const handleNewMessage = ({
      newMessage,
      chat_id,
      participants,
    }: {
      newMessage: IMessage;
      chat_id: string;
      participants: Participant[];
    }) => {
      const isParticipant = participants.some(
        (p: Participant) => p.userId == user.user_id
      );
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
              if (
                msg.chatId == selectedChat &&
                !msg.seen.some((item) => item.userId == user.user_id)
              ) {
                return {
                  ...msg,
                  seen: [
                    ...(msg.seen ?? []),
                    {
                      userId: user.user_id,
                      userName: user?.name || "",
                      seenAt: Date.now(),
                    },
                  ],
                };
              }
              return msg;
            }),
          };
        });
      });
    };

    const handleNewChat = ({ newChat }: { newChat: IChat }) => {
      const isParticipant = newChat.participants!.some(
        (p: Participant) => p.userId === user.user_id
      );
      if (!isParticipant) return;

      new Audio(newMessageNotification).play();
      setShowMenuListModal(false);
      setSelectedChat(newChat._id as string);

      setChats((prevChats) => {
        const chatExists = prevChats.some((chat) => chat._id === newChat._id);
        if (chatExists) return prevChats;

        const formattedChat = {
          ...newChat,
          name:
            newChat.participants!.length < 3
              ? newChat.participants?.find(
                  (p: Participant) => p.userId !== user.user_id
                )?.name
              : newChat.name,
        };

        return [...prevChats, formattedChat];
      });
    };

    const handleAcitiveMembers = ({ users }: { users: string[] }) => {
      setActiveMembers(users);
    };


    const handleDeletedMessage = ({
      chatId,
      messageId,
    }: {
      chatId: string;
      messageId: string;
    }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id !== chatId
            ? chat
            : chat.messages && chat.messages.length > 0
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg._id === messageId
                    ? { ...msg, text: "", type: "deleted" }
                    : msg
                ),
              }
            : chat
        )
      );
    };

    socket.on(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.CHAT.NEW_CHAT_CREATED, handleNewChat);
    socket.on(SOCKET_EVENTS.USER.ACTIVE_USERS, handleAcitiveMembers);
    socket.on(SOCKET_EVENTS.CHAT.DELETE_MESSAGE, handleDeletedMessage);
    socket.emit(SOCKET_EVENTS.USER.SET_ONLINE, { orgId: user.orgId, userId: user.user_id });
  }, [user.orgId, user.user_id]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchAllChats();
      initialFetchDone.current = true;
    }
  }, [user.user_id]);

  useEffect(() => {
    const filteredChats = chats.filter((chat) => chat.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const sortByLastMessageTime = (a: IChat, b: IChat) => {
      const getLastMessageTime = (chat: IChat) => {
        const lastMessage = chat.messages?.[chat.messages.length - 1];
        return lastMessage?.createdAt
          ? new Date(lastMessage.createdAt).getTime()
          : 0;
      };
      return getLastMessageTime(b) - getLastMessageTime(a);
    };

    setSortedChats([...filteredChats].sort(sortByLastMessageTime));
  }, [chats, searchTerm]);

  
  return (<>
        <CustomBreadCrumbs
        breadCrumbs={[
          [
            "Communications",
            `/${user.role == "agency" ? "agency" : "client"}/messages`,
          ],
          ["Messages", ""],
        ]}
      />
    <div className="w-full flex flex-wrap min-h-screen bg-slate-100  rounded-3xl">
      <div
        className={`md:w-1/3 w-full md:h-[40rem] h-screen overflow-y-auto md:border-r-2 pb-20 border-[#cbcbcb32] p-6 ${
          selectedChat !== "" ? "hidden md:block md:flex-wrap" : ""
        }`}
      >
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2"
            />
          </div>
           {user.role == "agency" && (
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
            <CustomTabsTrigger value="chats">Chats</CustomTabsTrigger>
          </CustomTabsList>
          <CustomTabsContent value="chats">
            {
              isMessagesLoading ? (
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
              ):(
                sortedChats.length > 0 && (
              <div className="space-y-6">
                <div>
                  <div className="space-y-2">
                    {sortedChats.map((chat) => {
                      const member = chat?.participants?.find(
                        (item: Participant) => item.userId !== user.user_id
                      );
                      const memberId = member ? member.userId : null;
                      const isMemberActive = activeMembers?.includes(
                        memberId as string
                      );

                      return (
                        <ChatItem
                          key={chat._id}
                          name={chat.name as string}
                          active={selectedChat === chat._id}
                          onClick={() => setSelectedChat(chat._id as string)}
                          messages={chat.messages!}
                          userId={user.user_id}
                          socket={socket as Socket}
                          chat_id={chat._id as string}
                          isMemberActive={isMemberActive}
                          participants={chat.participants}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )
              )
            }
          </CustomTabsContent>
        </CustomTabs>
      </div>

      {showMenuListModal && (
        <MenuListModal
          setShowMenuListModal={setShowMenuListModal}
          userId={user.user_id}
          orgId={user.orgId}
          userName={user?.organizationName || user.name}
          profile={user?.profile}
        />
      )}

      <div className="md:w-2/3 w-full md:flex flex bg-slate-100 relative">
        {selectedChat ? (
          <ChatInterface
            userId={user.user_id}
            orgId={user.orgId}
            chatId={selectedChat}
            socket={socket as Socket}
            userName={user.name ?? user.organizationName}
            onChatClose={() => setSelectedChat("")}
          />
        ) : (
          <div className=" sm:flex hidden absolute inset-0 flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-4 mx-auto">
                <Users className="text-slate-600" size={40} />
              </div>
              <h1 className="text-xl font-medium text-slate-700">
                Select a conversation
              </h1>
              <p className="text-slate-600 mt-2">
                Choose from your existing chats
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ChatPage;
