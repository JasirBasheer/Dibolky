
import { IBaseRepository } from 'mern.common';
import { ISocialMessage } from '@/models'

export interface ISocialMessageRepository extends IBaseRepository<ISocialMessage> {
    createMessages(orgId:string,messages:any): Promise<void>;
    getMessages(orgId: string, userId: string, platform: string, conversationId: string): Promise<any>;
}
