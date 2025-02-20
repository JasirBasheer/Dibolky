import React, { useEffect, useRef, useState } from 'react';
import { Search, Users, Briefcase, UserCircle, Plus } from 'lucide-react';
import axios from '@/utils/axios';
import ChatInterface from '@/components/agency.components/agencyside.components/chat.interface';
import createSocketConnection from '@/utils/socket';
import { MenuListModal } from '@/components/common.components/chat-menu-list.modal';
import newMessageNotification from '../../assets/audios/notification-2-269292.mp3'

interface User {
  organizationName?: string;
  id: string;
  orgId: string;
  name: string;
}

interface Message {
  text: string;
  senderId: string;
  senderName: string;
  timestamp?: Date;
}

interface Chat {
  _id: string;
  name: string;
  participants: Array<{
    userId: string;
    name: string;
  }>;
  messages: Message[];
  lastMessage?: Message;
}

interface ChatItemProps {
  name: string;
  active: boolean;
  onClick: () => void;
  isGroup?: boolean;
  messages: any;
  userId: string;
}
const ChatItem: React.FC<ChatItemProps> = ({ name, active, onClick, isGroup = false, messages, userId }) => {

  const unreadMessageCount = Array.isArray(messages)
    ? messages.reduce((acc, message) => {
      if (message.senderId !== userId && !message.seen.includes(userId)) {
        acc += 1;
      }
      return acc;
    }, 0)
    : 0;


  console.log(messages, unreadMessageCount);
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${active ? 'bg-slate-800' : 'hover:bg-slate-200'
        }`}
    >
      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
        {isGroup ? (
          <Briefcase className="text-slate-400" size={20} />
        ) : (
          <UserCircle className="text-slate-400" size={20} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium truncate ${active ? 'text-slate-200' : 'text-black'}`}>
          {name}
        </h3>
        <p className="text-xs text-slate-400 truncate">
          {messages && messages[messages.length-1]?.senderName ?  `${messages[messages.length-1].senderName.charAt(0).toUpperCase() + messages[messages.length-1].senderName.slice(1)} : ${messages[messages.length-1].text}`: "Start a new chat"}
        </p>
      </div>
    </div>
  )
}

const Chat: React.FC<{ user: User, ownerId: string, isAdmin?: boolean }> = ({ user, ownerId, isAdmin }) => {
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chats, setChats] = useState<any>([]);
  const socket = useRef<any>(null);
  const [showMenuListModal, setShowMenuListModal] = useState(false);
  const initialFetchDone = useRef<boolean>(false);

  console.log("ownerId",ownerId);

  const fetchAllMessages = async()=>{
    try {
      const res = await axios.post('/api/entities/get-messages',{ userId: ownerId })
      console.log(res)      
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAllChats = async () => {
    if (!ownerId) return;

    try {
      const res = await axios.post('/api/entities/get-chats', { userId: ownerId });
      const formattedChats = res.data.chats?.map((chat: Chat) => {
        if (chat.participants.length < 3) {
          const otherUser = chat.participants.find(p => p.userId !== ownerId);
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
    if (!user.orgId || !ownerId) return;

    const newSocket = createSocketConnection();
    socket.current = newSocket;
    socket.current.emit('set-up', { orgId: user.orgId, userId: ownerId });

    const handleNewMessage = ({ newMessage, chat_id, participants }) => {
      const isParticipant = participants.some((p) => p.userId == ownerId);
      console.log(isParticipant);
      if (!isParticipant) return;

      if (newMessage.senderId !== ownerId) {
        new Audio(newMessageNotification).play()
      }

      setChats(prevChats =>
        prevChats.map(chat =>
          chat._id == chat_id
            ? {
              ...chat,
              lastMessage: newMessage,
              messages: [...(chat.messages ?? []), newMessage]
            }
            : chat
        )
      );
    };

    const handleNewChat = ({ newChat }) => {
      const isParticipant = newChat.participants.some(p => p.userId === ownerId);
      if (!isParticipant) return;

      new Audio(newMessageNotification).play()
      setShowMenuListModal(false)
      setSelectedChat(newChat._id)

      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === newChat._id);
        if (chatExists) return prevChats;

        const formattedChat = {
          ...newChat,
          name: newChat.participants.length < 3
            ? newChat.participants.find(p => p.userId !== ownerId)?.name
            : newChat.name
        };

        return [...prevChats, formattedChat];
      });
    };


    const handleOnGroupCreated = ({ group }) => {
      const isParticipant = group.participants.some(
        (participant:any) => participant.userId == ownerId
      );
      if (isParticipant) {
        new Audio(newMessageNotification).play()
        setChats(prev => [...prev, group])
      }
    };


    socket.current.on('new-message-received', handleNewMessage);
    socket.current.on('new-chat-created', handleNewChat);
    socket.current.on('group-created', handleOnGroupCreated);

    return () => {
      socket.current?.disconnect();
    };
  }, [user.orgId, ownerId]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchAllChats();
      fetchAllMessages();
      initialFetchDone.current = true;
    }
  }, [ownerId]);

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups = filteredChats.filter(chat => chat.participants.length > 2)
  const individualChats = filteredChats.filter(chat => chat.participants.length <= 2);

  return (
    <div className="w-full flex flex-wrap min-h-screen bg-slate-100 rounded-3xl">
    <div className="md:w-1/3 w-full md:h-[40rem] h-screen overflow-y-auto md:border-r pb-20 border-slate-100 p-6">
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

        {groups.length > 0 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-600">
                <Briefcase size={20} />
                <h2 className="text-sm font-medium">Groups</h2>
              </div>
              <div className="space-y-2">
                {groups.map((chat, index) => (
                  <ChatItem
                    key={index}
                    name={chat.name}
                    active={selectedChat == chat._id}
                    onClick={() => setSelectedChat(chat._id)}
                    isGroup={true}
                    messages={chat.messages}
                    userId={ownerId}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {individualChats.length > 0 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-600">
                <Users size={20} />
                <h2 className="text-sm font-medium">Individual Chats</h2>
              </div>
              <div className="space-y-2">
                {individualChats.map((chat,index) => (
                  <ChatItem
                    key={index}
                    name={chat.name}
                    active={selectedChat == chat._id}
                    onClick={() => setSelectedChat(chat._id)}
                    isGroup={false}
                    messages={chat.messages}
                    userId={ownerId}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showMenuListModal && (
        <MenuListModal setShowMenuListModal={setShowMenuListModal} userId={ownerId} role='admin' orgId={user.orgId} userName={user?.organizationName || user.name} socket={socket} />
      )}

      <div className="md:w-2/3 md:flex hidden bg-slate-100 relative">
        {selectedChat ? (
          <ChatInterface
            userId={ownerId}
            orgId={user.orgId}
            chatId={selectedChat}
            userName={user.name ?? user.organizationName}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
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