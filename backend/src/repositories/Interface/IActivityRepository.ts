import { IActivity } from '@/models';
import { IActivityType } from '@/types';
import { IBaseRepository } from 'mern.common';

export interface IActivityRepository extends IBaseRepository<IActivity> {
    createActivity(orgId:string, activity: Partial<IActivityType>): Promise<void>;
    getActivities(options?: { orgId?: string; userId?: string; activityType?: string; limit?: number; skip?: number }): Promise<IActivity[] | null>;
    getActivitiesByUserId(orgId:string, user_id: string):Promise<IActivity[] | null>;
}
