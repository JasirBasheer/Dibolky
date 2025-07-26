import { Document } from 'mongoose';
import { 
  ActivityEntity, 
  ActivityType, 
  ActivityUser 
} from '@/types';

export interface IActivity extends Document {
  user: ActivityUser;
  activityType: ActivityType;
  entity: ActivityEntity;
  activity: string;
  redirectUrl?: string;
  timestamp:string;
}