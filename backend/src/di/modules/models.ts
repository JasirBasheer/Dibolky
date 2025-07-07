import { container } from "tsyringe";
import { noteSchema } from "@/models/note";
import influencerSchema, { influencerTenantSchema } from "@/models/influencer";
import { transactionSchema } from "@/models/transaction";
import { bucketSchema } from "@/models/bucket";
import clientSchema, { clientTenantSchema } from "@/models/client";
import { Plan } from "@/models/plan";
import { chatSchema, messageSchema } from "@/models/chat";
import agencySchema, { agencyTenantSchema } from "@/models/agency";
import { projectSchema } from "@/models/project";
import adminSchema from "@/models/admin";


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
