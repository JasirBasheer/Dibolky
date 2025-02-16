import React, { useEffect, useRef, useState } from 'react';
import { Search, Users, Briefcase, UserCircle } from 'lucide-react';
import axios from '@/utils/axios';
import ChatInterface from '@/components/agency.components/agencyside.components/chat.interface';
import { useSelector } from 'react-redux';
import createSocketConnection from '@/utils/socket';
import notificationSound from '../../assets/audios/notification-2-269292.mp3'
import chatCreatedNotification from '../../assets/audios/currectanswer.wav'


interface ChatItemProps {
  name: string;
  active: boolean;
  onClick: () => void;
  lastMessage: any;
  isGroup?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ name, active, onClick, lastMessage, isGroup = false }) => (
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
      <p className="text-xs text-slate-400 truncate">  {lastMessage?.senderName ? `${lastMessage.senderName.charAt(0).toUpperCase() + lastMessage.senderName.slice(1)} : ${lastMessage.text}` : "Start a new chat"}</p>
    </div>
  </div>
);

const ClientMessages = () => {
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const client = useSelector((state: any) => state.client);
  const socket = useRef<any>(null);
  const initialFetchDone = useRef(false)


  const fetchAllChats = async () => {
    try {
      const res = await axios.post('/api/entities/get-chats', { userId: client.id });
      setChats((prevChats: any) => {
        const updatedChats = res.data.chats?.map((item: any) => {
          if (item.participants.length < 3) {
            const user = item.participants.find((participant: any) => participant.userId !== client?.id);
            if (user) {
              return { ...item, name: user.name };
            }
          }
          return item;
        })
        return [...prevChats, ...updatedChats];
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    if (!client?.orgId || !client.id) return
    const newSocket = createSocketConnection();
    socket.current = newSocket;
    socket.current.emit('set-up', { orgId: client.orgId, userId: client.id })

    socket.current.on('group-created', ({ group }) => {
      const isParticipant = group.participants.some((participant) => participant.userId === client?.id);
      if (isParticipant) setChats((prev) => [...prev, group]);
    });

    socket.current.on('new-message-received', ({ newMessage, chat_id, participants }) => {
      const isParticipant = participants.some((item) => item.userId == client?.id)

      if (isParticipant) {
        if (newMessage.senderId != client?.id) new Audio(notificationSound).play()

        setChats((prev) => {
          return prev.map((chat) => {
            if (chat._id == chat_id) {
              return {
                ...chat,
                lastMessage: newMessage.text,
                messages: [...(chat.messages || []), newMessage]
              };
            }
            return chat;
          });
        });
      }
    })

    socket.current.on('new-chat-created', ({ newChat }) => {
      const isParticipant = newChat.participants.some(
        (participant) => participant.userId == client?.id
      );
      if (isParticipant) {
        new Audio(chatCreatedNotification).play()
        setChats(prevChats => {
          const chatExists = prevChats.some(chat => chat._id === newChat._id);
          if (chatExists) {
            return prevChats;
          }
          const formattedChat = {
            ...newChat,
            name: newChat.participants.length < 3 
              ? newChat.participants.find(p => p.userId !== client?.id)?.name 
              : newChat.name
          };

          return [...prevChats, formattedChat];
        });
      }
    });

    return () => {
      socket.current.disconnect();
    }
  }, [client?.orgId, client?.id])





  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchAllChats();
      initialFetchDone.current = true;
    }
  }, [])

  const filteredChats = chats.filter(chat =>
    chat.name && chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups = filteredChats.filter(chat => chat.participants.length > 2);
  const individualChats = filteredChats.filter(chat => chat.participants.length <= 2);




  return (
    <div className="w-full flex flex-wrap min-h-screen bg-slate-100 rounded-3xl">
      <div className="md:w-1/3 w-full md:h-[40rem] h-screen overflow-y-auto md:border-r pb-20 border-slate-100 p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div className="space-y-6">
          {groups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-600">
                <Briefcase className="text-slate-600" size={20} />
                <h2 className="text-sm font-medium">Groups</h2>
              </div>
              <div className="space-y-2">
                {groups.map((chat, index) => (
                  <ChatItem
                    key={index}
                    name={chat.name}
                    active={selected === chat._id}
                    lastMessage={chat.messages[chat.messages.length - 1]}
                    onClick={() => setSelected(chat._id)}
                    isGroup={true}
                  />
                ))}
              </div>
            </div>
          )}

          {individualChats.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-600">
                <Users className="text-slate-600" size={20} />
                <h2 className="text-sm font-medium">Individual Chats</h2>
              </div>
              <div className="space-y-2">
                {individualChats.map((chat, index) => (
                  <ChatItem
                    key={index}
                    name={chat.name}
                    active={selected === chat._id}
                    lastMessage={chat.messages[chat.messages.length - 1]}
                    onClick={() => setSelected(chat._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-2/3 md:flex hidden bg-slate-100 relative">
        {selected ? (
          <ChatInterface
            userId={client?.id}
            orgId={client?.orgId}
            chatId={selected}
            userName={client?.name}
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

export default ClientMessages;