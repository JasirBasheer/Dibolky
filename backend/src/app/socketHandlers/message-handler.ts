import { SOCKET_EVENTS } from "@/constants/socket-events";
import { IChatService } from "@/services";
import { IChat, Participant } from "@/types/chat";
import { activeUsers } from "@/utils";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";

export const handleChatingEvents = (
  io: Server,
  socket: Socket,
  chatService: IChatService
) => {
  socket.on(
    SOCKET_EVENTS.CHAT.CREATE_CHAT,
    async ({
      userId,
      targetUserId,
      orgId,
      userName,
      targetUserName,
      targetUserProfile,
      userProfile,
    }) => {
      try {
        console.log("cahtsaecacalled called");
        const isChatExists = await chatService.findChatByMembers(
          orgId,
          userId,
          targetUserId
        );

        if (isChatExists) {
          io.to(`user_${userId}`).emit(SOCKET_EVENTS.CHAT.NEW_CHAT_CREATED, {
            newChat: isChatExists,
          });
          return;
        }

        const newChat = await chatService.createChat(
          userId,
          targetUserId,
          orgId,
          userName,
          targetUserName,
          targetUserProfile,
          userProfile
        );

        io.to(`user_${userId}`).emit(SOCKET_EVENTS.CHAT.NEW_CHAT_CREATED, {
          newChat,
        });
        io.to(`user_${targetUserId}`).emit(
          SOCKET_EVENTS.CHAT.NEW_CHAT_CREATED,
          { newChat }
        );
      } catch (err) {
        console.error("CREATE_CHAT error:", err);
      }
    }
  );

  // socket.on(SOCKET_EVENTS.CHAT.TYPING, ({ to }) => {
  //   io.to(to).emit(SOCKET_EVENTS.CHAT.TYPING, { from: socket.id });
  // });

  // socket.on(SOCKET_EVENTS.CHAT.STOP_TYPING, ({ to }) => {
  //   io.to(to).emit(SOCKET_EVENTS.CHAT.STOP_TYPING, { from: socket.id });
  // });

  socket.on(
    SOCKET_EVENTS.CHAT.MESSAGE_SEEN,
    async ({ orgId, chatId, userId, userName, targetUserId }) => {
      try {
        await chatService.setSeenMessage(orgId, chatId, userId, userName);
        const targetConnections = activeUsers.get(targetUserId) || new Set();

        targetConnections.forEach((socketId) => {
          io.to(socketId).emit("seen", { chatId });
        });
      } catch (error) {
        console.error("Error setting seen message:", error);
        socket.emit("messageError", { error: "Failed to set seen" });
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.CHAT.SEND_MESSAGE,
    async ({ orgId, chatId, userId, userName, profile, message }) => {
      try {
        const messageData = {
          senderId: new Types.ObjectId(userId),
          senderName: userName,
          profile,
          text: message.text,
          type: message.type,
          key: message.key,
          contentType: message.contentType,
          seen: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const createdMessage = await chatService.sendMessage(
          messageData,
          orgId,
          chatId
        );
        const chat = (await chatService.getChat(orgId, chatId)) as IChat;

        const target = chat.participants.find(
          (p) => p.userId.toString() !== userId
        );

        const orgUsers = activeUsers.get(orgId);
        console.log(
          orgUsers?.has(target.userId.toString()),
          "check usere is t"
        );
        if (orgUsers?.has(target.userId.toString())) {
          io.to(`user_${target.userId.toString()}`).emit(
            SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE,
            {
              newMessage: createdMessage,
              chat_id: chatId,
              participants: chat?.participants,
              notify: true,
            }
          );
        }
        io.to(`user_${userId.toString()}`).emit(
          SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE,
          {
            newMessage: createdMessage,
            chat_id: chatId,
            participants: chat?.participants,
          }
        );
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.CHAT.DELETE_MESSAGE,
    async ({ orgId, chatId, messageId }) => {
      const roomId = `org_${orgId}`;
      io.to(roomId).emit("message-deleted", { chatId, messageId });
      await chatService.deleteMessage(orgId, messageId);
    }
  );

  socket.on(
    SOCKET_EVENTS.CHAT.MESSAGE_SEEN,
    async ({ orgId, chatId, userId, userName }) => {
      try {
        const roomId = `org_${orgId}`;
        await chatService.setSeenMessage(orgId, chatId, userId, userName);
        io.to(roomId).emit("seen", { chatId });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.CHAT.DELETE_MESSAGE,
    async ({ orgId, chatId, messageId }) => {
      const roomId = `org_${orgId}`;
      io.to(roomId).emit(SOCKET_EVENTS.CHAT.DELETE_MESSAGE, {
        chatId,
        messageId,
      });
      await chatService.deleteMessage(orgId, messageId);
    }
  );
};
