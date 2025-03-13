import { IMessage } from "../../types/chat.types";

export interface IMessageRepository {
    createMessage(orgId: string, chatId: string, details: Partial<IMessage>): Promise<IMessage | null>;
    deleteMessage(orgId: string, messageId: string): Promise<IMessage | null>;
    fetchMessages(orgId: string): Promise<IMessage[] | null>;
    fetchChatMessages(orgId: string, chatId: string): Promise<IMessage[]>;
    getMessageById(orgId: string, chatId: string): Promise<IMessage>;
    fetchChatByChatId(orgId: string, chatId: string): Promise<IMessage[]>;
    createCommonMessage(orgId: string, message: Partial<IMessage>): Promise<IMessage | null>;
    setSeenMessage(orgId: string, messageId: string, details: object): Promise<void>

}