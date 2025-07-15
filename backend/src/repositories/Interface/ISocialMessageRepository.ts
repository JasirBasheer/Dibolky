
import { IBaseRepository } from 'mern.common';
import { ISocialMessage } from '@/models'

export interface ISocialMessageRepository extends IBaseRepository<ISocialMessage> {
    createMessages(orgId:string,messages:any): Promise<void>;
}
