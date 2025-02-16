import mongoose from "mongoose";
import Chat from "../../models/chat/chat";
import { IChatRepository } from "../Interface/IChatRepository";
import { AnyAaaaRecord } from "dns";

export default class ChatRepository implements IChatRepository {

    async getChat(chatModel: any, userId: string, targetUserId: string): Promise<any> {
        return await chatModel.findOne({
            'participants.userId': { 
                $all: [
                    new mongoose.Types.ObjectId(userId),
                    new mongoose.Types.ObjectId(targetUserId)
                ]
            }
        });
    }


    async createNewChat(chatModel: any, details:any): Promise<any> {
    const chat = new chatModel({
        participants: [
            { userId: new mongoose.Types.ObjectId(details.userId),name:details.userName },
            { userId: new mongoose.Types.ObjectId(details.targetUserId),name:details.targetUserName }
        ],
        messages: []
    });
    return await chat.save();
    }
    
    async findChatById(chatModel:any,chatId:string):Promise<any>{
        return await chatModel.findOne({_id:chatId})
    }
    

    async createMessage(chatModel: any,chatId:any, details: any): Promise<any> {
        let chat = await chatModel.findOne({_id:chatId});
        chat.messages.push(details);
        return await chat.save();
   
    }

    async fetchChats(chatModel: any, userId: string): Promise<any> {
        console.log(chatModel, "ChatMOdel", userId, "UserId")

        const chats = await chatModel.find({
            // participants: {
            //     $elemMatch: { userId: userId }
            // }
        }).sort({ updatedAt: -1 });
        
        return chats || []
    }


    async fetchChatByChatId(chatModel: any, chatId:string): Promise<any>{
        return await chatModel.findOne({_id:chatId})
    }

    async createNewGroup(newGroupDetails: any, chatModel: any): Promise<any> {
        const newGroup = new chatModel(newGroupDetails)
        return await newGroup.save()
    }


    async findOwnerDetails(ownerModel:any,orgId:string):Promise<any>{
        return await ownerModel.findOne({orgId:orgId})
    }

    async addMember(chatModel:any,chatId:string,memberDetails:any):Promise<any>{
        const chat = await chatModel.findOne({_id:chatId})
        chat.participants.push(memberDetails)
        return await chat.save()
    }

    async createCommonMessage(chatModel:any,chatId:string,message:any):Promise<any>{
        const chat = await chatModel.findOne({_id:chatId})
        chat.messages.push(message)
        await chat.save()
    }

    async findChatByMembers(chatModel:any,userId:string,targetUserId:string):Promise<any>{
        return await chatModel.findOne({
            participants: {
              $all: [
                { $elemMatch: { userId: userId } },
                { $elemMatch: { userId: targetUserId } }
              ],
              $size: 2
            }
          });
              }




}
