
import { IBaseRepository } from 'mern.common';
import { ISocialUser } from '@/models'

export interface ISocialUserRepository extends IBaseRepository<ISocialUser> {
    createUser(orgId:string,social_user:Partial<ISocialUser>): Promise<ISocialUser>;
    getUsers(orgId:string, userId: string,platform:string, pageId?:string): Promise<ISocialUser[]>;
    getUsersWithPageId(orgId:string, userId: string,platform:string, linkedPage:string): Promise<ISocialUser[]>;
}
