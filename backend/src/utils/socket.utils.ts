import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { Server } from 'socket.io';
import { container } from 'tsyringe';
import mongoose from 'mongoose';
import { IChat } from "../types/chat";
import { IChatService } from "../services/Interface/IChatService";


const chatService = container.resolve<IChatService>('ChatService')

const initializeSocket = (server: HTTPServer | HTTPSServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    const activeUsers = new Map();
    io.on("connection", (socket) => {
        socket.on("set-up", ({ orgId, userId }) => {
            if (!activeUsers.get(orgId)) {
                activeUsers.set(orgId, [userId]);
            } else {
                const users = activeUsers.get(orgId);
                if (!users.includes(userId)) {
                    users.push(userId);
                }
            }
            
            const orgRoom = `org_${orgId}`;
            socket.join(orgRoom);
            io.to(orgRoom).emit("active-users", {users:activeUsers.get(orgId)});
        });

        socket.on("set-member-offline", ({ userId, orgId }) => {
            const users = activeUsers.get(orgId);
            if (users) {
                const updatedUsers = users.filter((id:{id:string}) => id !== userId);
                if (updatedUsers.length > 0) {
                    activeUsers.set(orgId, updatedUsers);
                } else {
                    activeUsers.delete(orgId); 
                }
        
                const orgRoom = `org_${orgId}`;
                io.to(orgRoom).emit("active-users", { users: updatedUsers });
            }
        });

        

        
        socket.on("send-message", async ({ orgId, chatId, userId, userName,profile, message }) => {
            try {
                const roomId = `org_${orgId}`;

                const messageData = {
                    senderId: new mongoose.Types.ObjectId(userId),
                    senderName: userName,
                    profile,
                    text: message.text,
                    type:message.type,
                    key:message.key,
                    contentType:message.contentType,
                    seen: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                console.log(messageData)
        
                const createdMessage = await chatService.sendMessage(messageData, orgId, chatId);
                const chat = await chatService.getChat(orgId,chatId) as IChat
                io.to(roomId).emit("new-message-received", { newMessage: createdMessage,chat_id:chatId,participants:chat?.participants });
               
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });


        socket.on("delete-message",async({orgId,chatId,messageId}) =>{
            const roomId = `org_${orgId}`;
            io.to(roomId).emit("message-deleted", { chatId,messageId });
            await chatService.deleteMessage(orgId,messageId);
        })


        socket.on("remove-member",async({orgId,chatId,memberId}) =>{
            const roomId = `org_${orgId}`;
            await chatService.removeMember(orgId,chatId,memberId)
            io.to(roomId).emit("member-removed", { chatId,memberId });

        })


        socket.on("set-seen", async ({ orgId, chatId, userId, userName  }) => {
            try {
                const roomId = `org_${orgId}`;
                await chatService.setSeenMessage(orgId, chatId, userId, userName)
                io.to(roomId).emit("seen", { chatId });
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });


        socket.on("create-chat", async ({ userId, targetUserId, orgId, userName, targetUserName,targetUserProfile,userProfile }) => {
            const roomId = `org_${orgId}`;
            const isChatExists = await chatService.findChatByMembers(orgId,userId,targetUserId)
            if(isChatExists){
            io.to(roomId).emit('new-chat-created', { newChat:isChatExists });
            return 
            }
            const newChat = await chatService.createChat(userId, targetUserId, orgId, userName, targetUserName,targetUserProfile,userProfile)
            if (newChat) io.to(roomId).emit('new-chat-created', { newChat });
        })

        socket.on("create-group", ({ group }) => {
            io.emit('group-created', ({ group }))
        });

        socket.on('add-member',async ({chatId, orgId, userId, userName, type, admin,targetUserProfile})=>{
            const roomId = `org_${orgId}`;
            const memberDetails = {userId,name:userName,type,profile:targetUserProfile}

      
            const createdMember = await chatService.addMember(orgId,chatId,memberDetails)
            console.log("createdMember",createdMember);

            const message = {chatId,text:`${admin} added ${memberDetails.name}`,type:"common",seen: []}
            if(createdMember){
                io.to(roomId).emit("new-message-received", { newMessage: message,chat_id:chatId,participants:createdMember.participants });
                io.to(roomId).emit("new-member-added", { member:memberDetails });
            }

            await chatService.createCommonMessage(orgId,message)            
        })

        // socket.on('remove-member')
        // socket.on('change group Name')


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export default initializeSocket;