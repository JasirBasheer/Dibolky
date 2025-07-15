import { Types } from "mongoose";

export type ActivityType = 'account_created' | 'plan_upgraded' | 'client_created' | 'project_created' | 'content_approved' | 'content_rejected';
type EntityType = 'client' | 'agency' | null;

export interface ActivityUser {
  userId: string;
  username: string;
  email: string;
}

export interface ActivityEntity {
  type: string;
  id?: Types.ObjectId;
}

export interface IActivityType {
  _id?: string;
  user: ActivityUser;
  activityType: string;
  entity: ActivityEntity;
  activity: string;
  redirectUrl?: string;
  createdAt?: string;
}