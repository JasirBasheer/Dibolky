import { container } from "tsyringe";
import { activitySchema, adminSchema, agencyTenantSchema, bucketSchema, chatSchema, clientTenantSchema, invoiceSchema, messageSchema, noteSchema, Plan, portfolioSchema, projectSchema, socialMessageSchema, socialUserSchema, testimonialSchema, transactionSchema } from "@/models";
import agencySchema from '@/models/Implementation/agency'
import clientSchema from '@/models/Implementation/client'

export const registerModels = () => {
container.register('admin_model', { useValue: adminSchema });
container.register('agency_model', { useValue: agencySchema });
container.register('agency_tenant_model', { useValue: agencyTenantSchema });
container.register('project_model', { useValue: projectSchema });
container.register('client_model', { useValue: clientSchema });
container.register('client_tenant_model', { useValue: clientTenantSchema });
container.register('chat_model', { useValue: chatSchema });
container.register('review_bucket_model', { useValue: bucketSchema });
container.register('transaction_model', { useValue: transactionSchema });
container.register('message_model', { useValue: messageSchema });
container.register('plan_model', { useValue: Plan });
container.register('note_model', { useValue: noteSchema });
container.register('activity_modal', { useValue: activitySchema });
container.register('social_user_modal', { useValue: socialUserSchema });
container.register('social_message_modal', { useValue: socialMessageSchema });
container.register('invoice_modal', { useValue: invoiceSchema });
container.register('portfolio_modal', { useValue: portfolioSchema });
container.register('testimonial_modal', { useValue: testimonialSchema });
};
