import mongoose, { Schema } from 'mongoose';
import { IActivity } from '../Interface';

export const activitySchema: Schema<IActivity> = new Schema({
  user: {
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  activityType: {
    type: String,
    required: true,
    enum: ['account_created', 'plan_upgraded', 'client_created', 'project_created', 'content_approved', 'content_rejected', 'invoice_payment'],
    index: true,
  },
  entity: {
    type: { type: String, enum: ['client', 'agency', null] },
    id: { type: String },
  },
  activity: {
    type: String,
    required: true,
  },
  redirectUrl: {
    type: String,
  },
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false },
});

export default mongoose.model<IActivity>('Activity', activitySchema);