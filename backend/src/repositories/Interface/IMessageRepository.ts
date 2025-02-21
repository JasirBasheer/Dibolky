import { IMessage } from "../../shared/types/chat.types";

export interface IMessageRepository {
    createMessage(chatModel: any, messageModel: any, chatId: string, details: any): Promise<IMessage | null>;
    fetchMessages(messageModel: any): Promise<IMessage[] | null>;
    fetchChatMessages(messageModel: any, chatId: string): Promise<IMessage[]>;
    fetchChatByChatId(chatModel: any, chatId: string): Promise<IMessage[]>;
    createCommonMessage(chatModel: any, message: any): Promise<Partial<IMessage> | null>;
}