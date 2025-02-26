import { IMessage } from "../../shared/types/chat.types";

export interface IMessageRepository {
    createMessage(orgId: string, chatId: string, details: Partial<IMessage>): Promise<IMessage | null>;
    fetchMessages(orgId: string): Promise<IMessage[] | null>;
    fetchChatMessages(orgId: string, chatId: string): Promise<IMessage[]>;
    fetchChatByChatId(orgId: string, chatId: string): Promise<IMessage[]>;
    createCommonMessage(orgId: string, message: Partial<IMessage>): Promise<IMessage | null>;
}