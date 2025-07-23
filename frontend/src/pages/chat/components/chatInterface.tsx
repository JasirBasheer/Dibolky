import React, { useEffect, useRef, useState } from "react";
import axios from "@/utils/axios";
import { formatDateTime } from "@/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMessage, IParticipant, RootState } from "@/types/common";
import { EmojiClickData, IChat } from "@/types/chat.types";
import {
  ChevronLeft,
  LucideCheckCheck,
  Paperclip,
  Send,
  Smile,
  Trash,
  Users,
  X,
} from "lucide-react";
import { message } from "antd";
import { useSelector } from "react-redux";
import {
  fetchChatsApi,
  getSignedUrlApi,
} from "@/services/common/post.services";
import Skeleton from "react-loading-skeleton";
import MediaDisplay from "@/components/common/media-display";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/constants";
import { ChatDetails } from "./chatDetails";

const ChatInterface = ({
  userId,
  orgId,
  chatId,
  socket,
  userName,
  onChatClose,
}: {
  userId: string;
  orgId: string;
  chatId: string;
  socket: Socket;
  userName: string;
  onChatClose: () => void;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<{
    text: string;
    file: File | null;
    contentType: string | null;
  }>({ text: "", file: null, contentType: null });
  const [showChatDetails, setShowChatDetails] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [chatDetails, setChatDetails] = useState<IChat>({ _id: "" });
  const [showDeleteMessage, setShowDeleteMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [participantsWithProfiles, setParticipantsWithProfiles] = useState<
    IParticipant[]
  >([]);
  const [isMessageSending, setIsMessageSending] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleMediaClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      const payload = JSON.stringify({ userId, orgId });

      navigator.sendBeacon(
        `${import.meta.env.VITE_BACKEND}/api/socket/set-offline`,
        new Blob([payload], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, orgId]);

  const handleFileUploadClick = async (files: File[]) => {
    const file = files[0];
    const fileName = file?.name;
    const fileExtension = fileName?.split(".").pop()?.toLowerCase();
    const isSupported =
      ["jpeg", "jpg", "png"].includes(fileExtension || "") ||
      ["mov", "mp4"].includes(fileExtension || "");
    const fileSizeMB = file.size / (1024 * 1024);
    const maxSizeMB = 10;

    if (!isSupported) {
      message.error("Only jpeg, png, mov, mp4 are supported");
      return;
    }

    if (fileSizeMB > maxSizeMB) {
      message.error(`File size should not exceed ${maxSizeMB} MB`);
      return;
    }

    setNewMessage((prev) => ({
      ...prev,
      file: file,
      contentType: ["jpeg", "jpg", "png"].includes(fileExtension || "")
        ? "image"
        : ("video" as string),
    }));
  };

  const fetchRecentMessages = async () => {
    try {
      if (!socket) return;
      socket.emit(SOCKET_EVENTS.CHAT.MESSAGE_SEEN, {
        orgId,
        chatId,
        userId,
        userName,
      });

      const res = await fetchChatsApi(chatId);

      const messages = res.data.chats.messages || [];
      const { message, ...details } = res.data.chats;
      setChatDetails(details);

      const updatedMessages = await Promise.all(
        messages.map(async (msg: IMessage) => {
          if (msg.key) {
            const signedUrlRes = await getSignedUrlApi(msg.key);
            return { ...msg, key: signedUrlRes.data.signedUrl };
          }
          return msg;
        })
      );

      setMessages(updatedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!chatDetails?.participants || chatDetails.participants.length === 0)
        return;

      try {
        const updatedParticipants = await Promise.all(
          chatDetails.participants.map(async (participant) => {
            try {
              const url = await getSignedUrlApi(
                String(participant.profile) || ""
              );
              return { ...participant, profileUrl: url.data.signedUrl || "" };
            } catch (error) {
              console.error(
                `Failed to fetch URL for ${participant.name}:`,
                error
              );
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

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT.MESSAGE_SEEN, {
        orgId,
        chatId,
        userId,
        userName,
      });
    };
  }, [chatDetails._id]);

  useEffect(() => {
    if (!userId || !socket || !chatId) return;

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
        const isParticipant = participants.some(
          (item) => item.userId === userId
        );
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

    const handleDeletedMessage = ({
      messageId,
    }: {
      chatId: string;
      messageId: string;
    }) => {
      setMessages((prev) => {
        return prev.map((item) => {
          if (item._id == messageId) {
            return {
              ...item,
              text: "",
              fileUrl: "",
              type: "deleted",
            };
          }
          return item;
        });
      });
    };

    socket.on(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.CHAT.DELETE_MESSAGE, handleDeletedMessage);

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT.MESSAGE_SEEN, {
        orgId,
        chatId,
        userId,
        userName,
      });
      socket.off(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleNewMessage);
    };
  }, [userId, chatId]);

  useEffect(() => {
    if (chatId) {
      fetchRecentMessages();
    }
  }, [chatId]);

  const handleChange = (value: string, key: string) => {
    setNewMessage((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSendMessage = async () => {
    try {
      setIsMessageSending(true);
      let file = null;

      if (!newMessage?.text?.trim() && !newMessage?.file) {
        setIsMessageSending(false);
        return;
      }
      if (newMessage.file != null) {
        const fileData = {
          fileName: newMessage?.file?.name,
          fileType: newMessage?.file?.type,
          fileSize: newMessage?.file?.size,
        };
        const response = await axios.post("/api/entities/get-s3Upload-url", {
          file: fileData,
        });
        file = response?.data?.s3file;
        console.log(file, "fileeee");

        await axios.put(file.url, newMessage?.file, {
          headers: {
            "Content-Type": file?.contentType,
            "Content-Disposition": "inline",
          },
          withCredentials: false,
        });
      }

      const message = {
        text: newMessage.text,
        type: "text",
        key: file?.key ?? null,
        contentType: newMessage.contentType ?? null,
      };
      socket.emit(SOCKET_EVENTS.CHAT.SEND_MESSAGE, {
        orgId,
        chatId,
        userId,
        userName,
        profile: user.profile,
        message,
      });

      setNewMessage({ text: "", file: null, contentType: null });
      setIsMessageSending(false);
    } catch (error) {
      setIsMessageSending(false);
      message.error("An unexpected error occured while sending message");
      console.log(error);
    }
  };

  const handleDeleteMesage = (chatId: string, messageId: string) => {
    if (!messageId || !socket) return;
    setIsDeleting(true);
    socket.emit(SOCKET_EVENTS.CHAT.DELETE_MESSAGE, {
      orgId,
      chatId,
      messageId,
    });
    setShowDeleteMessage("");
    setIsDeleting(false);
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAddMember = async (
    targetUserId: string,
    targetUsername: string,
    targetType: string,
    targetUserProfile: string
  ) => {
    try {
      if (!chatId || !orgId || !userName) {
        console.error("Missing required data for adding member:", {
          chatId,
          orgId,
          userName,
        });
        return;
      }

      socket.emit("set-up", { orgId, userId });

      console.log({
        chatId,
        orgId,
        userId: targetUserId,
        userName: targetUsername,
        type: targetType,
        admin: userName,
      });
      socket.emit("add-member", {
        chatId,
        orgId,
        userId: targetUserId,
        userName: targetUsername,
        type: targetType,
        admin: userName,
        targetUserProfile,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    console.log(emojiData);
    setNewMessage((prev) => ({ ...prev, text: prev.text + emojiData.native }));
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-[40rem] w-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <ChevronLeft onClick={onChatClose} className="cursor-pointer" />
          {chatDetails.participants && chatDetails?.participants?.length < 3 ? (
            <Avatar
              className="w-10 h-10 rounded-full overflow-hidden flex items-center bg-slate-500   justify-center"
              onClick={() => setShowChatDetails(true)}
            >
              <AvatarImage
                src={
                  participantsWithProfiles?.find(
                    (item) => item.userId != userId
                  )?.profileUrl
                }
                className="h-full w-full object-cover"
                alt={
                  participantsWithProfiles?.find(
                    (item) => item.userId != userId
                  )?.name || "Unknown"
                }
              />
              <AvatarFallback className="bg-primary/10">
                {participantsWithProfiles
                  ?.find((item) => item.userId != userId)
                  ?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
              <Users
                className="text-slate-600"
                size={20}
                onClick={() => setShowChatDetails(true)}
              />
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

      <div ref={messageContainerRef} className="flex-1 overflow-y-auto">
        {messages.map((msg: IMessage, index: React.Key | null | undefined) => {
          const seenMembers =
            msg.seen?.filter((item) => item.userId != userId) ?? [];
          return msg.type === "common" ? (
            <div key={index} className="flex items-center justify-center p-2">
              <span className="text-xs text-slate-500">{msg.text}</span>
            </div>
          ) : msg.type === "deleted" ? (
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
            <div
              key={index}
              className="flex items-start max-w-full bg-[#c3bdbd1c] px-7"
              onClick={() => setShowDeleteMessage("")}
            >
              <Avatar className="w-10 h-10 rounded-md overflow-hidden flex items-center bg-slate-500 mt-4  justify-center">
                <AvatarImage
                  src={
                    participantsWithProfiles?.find(
                      (item) => item.userId == msg.senderId
                    )?.profileUrl
                  }
                  className="h-full w-full object-cover"
                  alt={
                    participantsWithProfiles?.find(
                      (item) => item.userId == msg.senderId
                    )?.name || "Unknown"
                  }
                />
                <AvatarFallback className="bg-primary/10">
                  {participantsWithProfiles
                    ?.find((item) => item.userId == msg.senderId)
                    ?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div
                  className="rounded-lg p-4 relative "
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 mb-1 justify-start">
                    <span className="font-normal text-sm text-grey-00">
                      You
                    </span>
                    <span className="text-[0.6rem] mt-1">
                      {formatDateTime(msg?.createdAt as string)}
                    </span>

                    <div className="relative group">
                      <button
                        className="text-black p-1 "
                        onClick={() =>
                          setShowDeleteMessage((prev) =>
                            prev == "" ? (msg._id as string) : ""
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                      <div
                        className={`absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 ${
                          showDeleteMessage == msg._id ? "block" : "hidden"
                        }`}
                      >
                        {isDeleting ? (
                          <Skeleton width={100} height={14} />
                        ) : (
                          <button
                            onClick={() =>
                              handleDeleteMesage(
                                msg.chatId as string,
                                msg._id as string
                              )
                            }
                            className="px-1 py-1 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                          >
                            <Trash width={15} />
                            Delete message
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {(msg.contentType === "image" ||
                    msg.contentType === "video") && (
                    <MediaDisplay
                      url={msg.key as string}
                      contentType={msg.contentType}
                    />
                  )}

                  <p className="text-black">{msg.text}</p>

                  <LucideCheckCheck
                    width={12}
                    color={`${seenMembers?.length == 0 ? "grey" : "blue"}`}
                  />
                </div>
                <div className="flex items-center gap-1 justify-evenly"></div>
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="flex items-start max-w-full bg-[#ffffffe0] px-7 py-2"
            >
              <Avatar className="w-10 h-10 rounded-md overflow-hidden flex items-center bg-slate-500 mt-4  justify-center">
                <AvatarImage
                  src={
                    participantsWithProfiles?.find(
                      (item) => item.userId == msg.senderId
                    )?.profileUrl
                  }
                  className="h-full w-full object-cover"
                  alt={
                    participantsWithProfiles?.find(
                      (item) => item.userId == msg.senderId
                    )?.name || "Unknown"
                  }
                />
                <AvatarFallback className="bg-primary/10">
                  {participantsWithProfiles
                    ?.find((item) => item.userId == msg.senderId)
                    ?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className=" rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-normal text-sm text-black">
                      {msg.senderName
                        ? msg.senderName.charAt(0).toUpperCase() +
                          msg.senderName.slice(1)
                        : "Unknown"}
                      <span className="text-[0.6rem] ml-2 text-black">
                        {formatDateTime(msg?.createdAt as string)}
                      </span>
                    </span>
                  </div>
                  {(msg.contentType === "image" ||
                    msg.contentType === "video") && (
                    <MediaDisplay
                      url={msg.key as string}
                      contentType={msg.contentType}
                    />
                  )}
                  <p className="text-black">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showChatDetails && (
        <ChatDetails
          setShowChatDetails={setShowChatDetails}
          details={chatDetails}
          userId={userId}
          onAddMember={handleAddMember}
          orgId={orgId}
          chatId={chatId}
        />
      )}

      {showEmojiPicker && (
        <div className="absolute z-10 bottom-56">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
      <div className="p-4 border-t border-slate-200">
        {newMessage.file && (
          <div className="flex items-center mb-2 bg-slate-100 rounded-lg px-3 py-1 text-sm text-slate-700">
            <span className="truncate flex-1">{newMessage.file.name}</span>
            <button
              onClick={() =>
                setNewMessage((prev) => ({
                  ...prev,
                  file: null,
                }))
              }
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
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <Smile size={20} className="text-slate-600" />
                </button>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUploadClick(Array.from(e.target.files));
                }
              }}
            />
          </div>
          <input
            type="text"
            value={newMessage.text}
            onChange={(e) => handleChange(e.target.value, "text")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
  );
};

export default ChatInterface;
