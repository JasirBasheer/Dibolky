import React, { useEffect, useRef, useState } from 'react'
import axios from '@/utils/axios';
import { formatDate, formatDateTime } from '@/utils/utils';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IMessage, IParticipant, RootState } from '@/types/common';
import { EmojiClickData, IAvailabeUser, IChat } from '@/types/chat.types';
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
import MediaDisplay from '@/components/common/media-display';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { fetchAvailableUsersApi } from '@/services/agency/get.services';
import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@/constants';
import socket from '@/sockets';

interface ChatDetailsProps {
  setShowChatDetails: (arg0: boolean) => void;
  details: IChat;
  userId: string;
  onAddMember: (targetUserId: string, targetUsername: string, targetType: string, targetUserProfile: string) => void;
  orgId: string;
  chatId: string;
}

export const ChatDetails: React.FC<ChatDetailsProps> = ({ setShowChatDetails, details, userId, onAddMember, orgId, chatId }) => {
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

