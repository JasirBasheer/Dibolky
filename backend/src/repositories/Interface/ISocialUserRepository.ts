
import { IBaseRepository } from 'mern.common';
import { ISocialUser } from '@/models'

export interface ISocialUserRepository extends IBaseRepository<ISocialUser> {
    createUser(orgId:string,social_user:any): Promise<any>;
    getUsers(orgId:string, userId: string,platform:string, pageId?:string): Promise<any>;
    getUsersWithPageId(orgId:string, userId: string,platform:string, pageId:string): Promise<any>;
}
