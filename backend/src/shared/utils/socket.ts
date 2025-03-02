import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { IChatService } from '../../services/Interface/IChatService';
import mongoose from 'mongoose';
import { IChat } from "../types/chat.types";


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
            activeUsers.set(userId, {
                socketId: socket.id,
                orgId
            });
            const orgRoom = `org_${orgId}`;
            socket.join(orgRoom);
        });

        
        socket.on("send-message", async ({ orgId, chatId, userId, userName, message }) => {
            try {
                const roomId = `org_${orgId}`;
                console.log(orgId, chatId, userId, userName, message);

                const messageData = {
                    senderId: new mongoose.Types.ObjectId(userId),
                    senderName: userName,
                    text: message.text,
                    type:message.type,
                    seen: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
        
                await chatService.sendMessage(messageData, orgId, chatId);
                const chat = await chatService.getChat(orgId,chatId) as IChat

                io.to(roomId).emit("new-message-received", { newMessage: messageData,chat_id:chatId,participants:chat?.participants });
               
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });


        socket.on("create-chat", async ({ userId, targetUserId, orgId, userName, targetUserName }) => {
            const roomId = `org_${orgId}`;
            const isChatExists = await chatService.findChatByMembers(orgId,userId,targetUserId)
            if(isChatExists){
            io.to(roomId).emit('new-chat-created', { newChat:isChatExists });
            console.log(isChatExists);
            return 
            }
            const newChat = await chatService.createChat(userId, targetUserId, orgId, userName, targetUserName)
            if (newChat) io.to(roomId).emit('new-chat-created', { newChat });
        })

        socket.on("create-group", ({ group }) => {
            io.emit('group-created', ({ group }))
        });

        socket.on('add-member',async ({chatId, orgId, userId, userName, type, admin})=>{
            const roomId = `org_${orgId}`;
            const memberDetails = {userId,name:userName,type}
            console.log("memberDetails",memberDetails);

      
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