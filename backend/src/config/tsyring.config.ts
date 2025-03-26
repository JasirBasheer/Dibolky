import "reflect-metadata";
import { container } from "tsyringe";
import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController'
import AuthenticationController from '../controllers/Implementation/authentication.controller'
import AdminRepository from "../repositories/Implementation/admin.repository";
import { IAdminRepository } from '../repositories/Interface/IAdminRepository';
import { IAgencyRepository } from '../repositories/Interface/IAgencyRepository';
import { AgencyRepository } from '../repositories/Implementation/agency.repository';
import EntityRepository from '../repositories/Implementation/entity.repository';
import { IEntityRepository } from '../repositories/Interface/IEntityRepository';
import PlanRepository from '../repositories/Implementation/plan.repository';
import { IPlanRepository } from '../repositories/Interface/IPlanRepository';
import { IAdminService } from '../services/Interface/IAdminService';
import AdminService from '../services/Implementation/admin.service';
import AgencyService from '../services/Implementation/agency.service';
import { IAgencyService } from '../services/Interface/IAgencyService';
import AuthenticationService from '../services/Implementation/authentication.service';
import { IAuthenticationService } from '../services/Interface/IAuthenticationService';
import { IEntityService } from '../services/Interface/IEntityService';
import EntityService from '../services/Implementation/entity.service';
import PaymentService from '../services/Implementation/payment.service';
import { IPaymentService } from '../services/Interface/IPaymentService';
import { IAdminController } from '../controllers/Interface/IAdminController';
import AdminController from '../controllers/Implementation/admin.controller';
import { IAgencyController } from '../controllers/Interface/IAgencyController';
import AgencyController from '../controllers/Implementation/agency.controller';
import { IEntityController } from '../controllers/Interface/IEntityController';
import EntityController from '../controllers/Implementation/entity.controller';
import { IPaymentController } from '../controllers/Interface/IPaymentController';
import PaymentController from '../controllers/Implementation/payment.controller';
import { IClientRepository } from "../repositories/Interface/IClientRepository";
import ClientRepository from "../repositories/Implementation/client.repository";
import { IClientService } from "../services/Interface/IClientService";
import ClientService from "../services/Implementation/client.service";
import { IClientController } from "../controllers/Interface/IClientController";
import ClientController from "../controllers/Implementation/client.controller";
import { IProviderController } from "../controllers/Interface/IProviderController";
import ProviderController from "../controllers/Implementation/provider.controller";
import { IProviderService } from "../services/Interface/IProviderService";
import ProviderService from "../services/Implementation/provider.service";
import adminSchema from "../models/admin.model";
import ChatRepository from "../repositories/Implementation/chat.repository";
import { IChatRepository } from "../repositories/Interface/IChatRepository";
import { IChatService } from "../services/Interface/IChatService";
import ChatService from "../services/Implementation/chat.service";
import agencySchema, { agencyTenantSchema } from "../models/agency.model";
import { projectSchema } from "../models/project.model";
import { ProjectRepository } from "../repositories/Implementation/project.repository";
import { IProjectRepository } from "../repositories/Interface/IProjectRepository";
import { chatSchema, messageSchema } from "../models/chat.model";
import { IClientTenantRepository } from "../repositories/Interface/IClientTenantRepository";
import { ClientTenantRepository } from "../repositories/Implementation/client-tenant.repository";
import { IContentRepository } from "../repositories/Interface/IContentRepository";
import { ContentRepository } from "../repositories/Implementation/content.repository";
import { IMessageRepository } from "../repositories/Interface/IMessageRepository";
import MessageRepository from "../repositories/Implementation/message.repository";
import { ITransactionRepository } from "../repositories/Interface/ITransactionRepository";
import TransactionRepository from "../repositories/Implementation/transaction.repository";
import { IAgencyTenantRepository } from "../repositories/Interface/IAgencyTenantRepository";
import AgencyTenantRepository from "../repositories/Implementation/agency-tenant.repository";
import { transactionSchema } from "../models/transaction.model";
import { bucketSchema } from "../models/bucket.model";
import clientSchema, { clientTenantSchema } from "../models/client.model";
import { Plan } from "../models/plan.model";
import InfluencerController from "../controllers/Implementation/influencer.controller";
import { IInfluencerController } from "../controllers/Interface/IInfluencerController";
import { IInfluencerService } from "../services/Interface/IInfluencerService";
import InfluencerService from "../services/Implementation/influencer.service";
import { IInfluencerRepository } from "../repositories/Interface/IInfluencerRepository";
import InfluencerRepository from "../repositories/Implementation/influencer.repository";
import { IInfluencerTenantRepository } from "../repositories/Interface/IInfluencerTenantRepository";
import InfluencerTenantRepository from "../repositories/Implementation/influencer-tenant.repository";
import { IManagerController } from "../controllers/Interface/IManagerController";
import ManagerController from "../controllers/Implementation/manager.controller";
import { IManagerService } from "../services/Interface/IManagerService";
import ManagerService from "../services/Implementation/manager.service";
import { IManagerRepository } from "../repositories/Interface/IManagerRepository";
import ManagerRepository from "../repositories/Implementation/manager.repository";
import { IManagerTenantRepository } from "../repositories/Interface/IManagerTenantRepository";
import ManagerTenantRepository from "../repositories/Implementation/manager-tenant.repository";
import influencerSchema, { influencerTenantSchema } from "../models/influencer.model";
import { INoteRepository } from "../repositories/Interface/INoteRepository";
import NoteRepository from "../repositories/Implementation/note.repository";
import { noteSchema } from "../models/note.model";




//* Model Registeration
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



//* Repo Registeration
container.register<IAdminRepository>('AdminRepository', { useClass: AdminRepository });
container.register<IAgencyRepository>('AgencyRepository', { useClass: AgencyRepository });
container.register<IEntityRepository>('EntityRepository', { useClass: EntityRepository });
container.register<IPlanRepository>('PlanRepository', { useClass: PlanRepository });
container.register<IClientRepository>('ClientRepository', { useClass: ClientRepository });
container.register<IChatRepository>('ChatRepository', { useClass: ChatRepository });
container.register<IProjectRepository>('ProjectRepository', { useClass: ProjectRepository });
container.register<IChatRepository>('ChatRepository', { useClass: ChatRepository });
container.register<IClientTenantRepository>('ClientTenantRepository', { useClass: ClientTenantRepository });
container.register<IContentRepository>('ContentRepository', { useClass: ContentRepository });
container.register<IMessageRepository>('MessageRepository', { useClass: MessageRepository });
container.register<ITransactionRepository>('TransactionRepository', { useClass: TransactionRepository });
container.register<IAgencyTenantRepository>('AgencyTenantRepository', { useClass: AgencyTenantRepository });
container.register<IInfluencerRepository>('InfluencerRepository', { useClass: InfluencerRepository });
container.register<IInfluencerTenantRepository>('InfluencerTenantRepository', { useClass: InfluencerTenantRepository });
container.register<IInfluencerTenantRepository>('InfluencerTenantRepository', { useClass: InfluencerTenantRepository });
container.register<IManagerRepository>('ManagerRepository', { useClass: ManagerRepository });
container.register<IManagerTenantRepository>('ManagerTenantRepository', { useClass: ManagerTenantRepository });
container.register<INoteRepository>('NoteRepository', { useClass: NoteRepository });



//* Service Registeration
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });
container.register<IAdminService>('AdminService', { useClass: AdminService });
container.register<IAgencyService>('AgencyService', { useClass: AgencyService });
container.register<IEntityService>('EntityService', { useClass: EntityService });
container.register<IPaymentService>('PaymentService', { useClass: PaymentService });
container.register<IClientService>('ClientService', { useClass: ClientService });
container.register<IProviderService>('ProviderService', { useClass: ProviderService });
container.register<IChatService>('ChatService', { useClass: ChatService });
container.register<IInfluencerService>('InfluencerService', { useClass: InfluencerService });
container.register<IManagerService>('ManagerService', { useClass: ManagerService });




//* Controller Registeration
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAgencyController>('AgencyController', { useClass: AgencyController });
container.register<IClientController>('ClientController', { useClass: ClientController });
container.register<IEntityController>('EntityController', { useClass: EntityController });
container.register<IPaymentController>('PaymentController', { useClass: PaymentController });
container.register<IProviderController>('ProviderController', { useClass: ProviderController });
container.register<IInfluencerController>('InfluencerController', { useClass: InfluencerController });
container.register<IManagerController>('ManagerController', { useClass: ManagerController });