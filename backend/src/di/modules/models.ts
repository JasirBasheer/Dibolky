import { container } from "tsyringe";
import { noteSchema } from "@/models/Implementation/note";
import influencerSchema, { influencerTenantSchema } from "@/models/Implementation/influencer";
import { transactionSchema } from "@/models/Implementation/transaction";
import { bucketSchema } from "@/models/Implementation/bucket";
import clientSchema, { clientTenantSchema } from "@/models/Implementation/client";
import { Plan } from "@/models/Implementation/plan";
import { chatSchema, messageSchema } from "@/models/Implementation/chat";
import agencySchema, { agencyTenantSchema } from "@/models/Implementation/agency";
import { projectSchema } from "@/models/Implementation/project";
import adminSchema from "@/models/Implementation/admin";


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
container.register('influencer_model', { useValue: influencerSchema });
container.register('influencer_tenant_model', { useValue: influencerTenantSchema });
container.register('note_model', { useValue: noteSchema });

container.register('manager_model', { useValue: Plan });
container.register('manager_tenant_model', { useValue: Plan });

};
