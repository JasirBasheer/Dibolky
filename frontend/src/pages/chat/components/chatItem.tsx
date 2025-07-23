import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { ChatItemProps } from '@/types/chat.types';
import { getSignedUrlApi } from '@/services/common/post.services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';


export const ChatItem: React.FC<ChatItemProps> = ({ name, active, onClick, isGroup = false, messages, userId, socket, chat_id, isMemberActive = false, activeMemberCount = 0, participants }) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  const [profileUrl, setProfileUrl] = useState<string>("")

  useEffect(() => {
    if (isGroup) return;

    const foundMember = participants?.find((item) => item.userId !== userId);
    if (!foundMember?.userId) return;

    const getProfileUrl = async () => {
      try {
        if(foundMember.profile == "")return
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
    if (!socket || !userId) return;

    const handleSeen = ({ chatId }: { chatId: string }) => {
      if (chatId === chat_id && active) {
        setUnreadMessageCount(0);

      }
    };

    socket.on("seen", handleSeen);
    return () => {
      socket.off("seen", handleSeen);
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

