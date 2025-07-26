
export type ActivityType = 'account_created' | 'plan_upgraded' | 'client_created' | 'project_created' | 'content_approved' | 'content_rejected' | 'invoice_payment';

export interface ActivityUser {
  userId: string;
  username: string;
  email: string;
}

export interface ActivityEntity {
  type: string;
  id?: string;
}

export interface IActivityType {
  _id?: string;
  user: ActivityUser;
  activityType: string;
  entity: ActivityEntity;
  activity: string;
  redirectUrl?: string;
  createdAt?: string;
  timestamp:string;
}