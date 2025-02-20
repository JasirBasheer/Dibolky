import "reflect-metadata";
import { container } from "tsyringe";
import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController'
import AuthenticationController from '../controllers/Implementation/authentication.controller'
import  AdminRepository  from "../repositories/Implementation/admin.repository";
import { IAdminRepository } from '../repositories/Interface/IAdminRepository';
import { IAgencyRepository } from '../repositories/Interface/IAgencyRepository';
import  AgencyRepository  from '../repositories/Implementation/agency.repository';
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
import Admin from "../models/admin/admin.model";
import ChatRepository from "../repositories/Implementation/chat.repository";
import { IChatRepository } from "../repositories/Interface/IChatRepository";
import { IChatService } from "../services/Interface/IChatService";
import ChatService from "../services/Implementation/chat.service";

//* Model Registeration
container.register('AdminModel', { useValue: Admin });
// container.register('AGENCY_MODEL', { useValue: agencyModel });
// container.register('CLIENT_MODEL', { useValue: Client });
// container.register('PROJECT_MODEL', { useValue: Client });
// container.register('PLAN_MODEL', { useValue: Client });
// container.register('CHAT_MODEL', { useValue: Client });
// container.register('CHAT_MODEL', { useValue: Client });


//* Repo Registeration
container.register<IAdminRepository>('AdminRepository', { useClass: AdminRepository });
container.register<IAgencyRepository>('AgencyRepository', { useClass: AgencyRepository });
container.register<IEntityRepository>('EntityRepository', { useClass: EntityRepository });
container.register<IPlanRepository>('PlanRepository', { useClass: PlanRepository });
container.register<IClientRepository>('ClientRepository', { useClass: ClientRepository });
container.register<IChatRepository>('ChatRepository', { useClass: ChatRepository });



//* Service Registeration
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });
container.register<IAdminService>('AdminService', { useClass: AdminService });
container.register<IAgencyService>('AgencyService', { useClass: AgencyService });
container.register<IEntityService>('EntityService', { useClass: EntityService });
container.register<IPaymentService>('PaymentService', { useClass: PaymentService });
container.register<IClientService>('ClientService', { useClass: ClientService });
container.register<IProviderService>('ProviderService', { useClass: ProviderService });
container.register<IChatService>('ChatService', { useClass: ChatService });




//* Controller Registeration
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAgencyController>('AgencyController', { useClass: AgencyController });
container.register<IClientController>('ClientController', { useClass: ClientController });
container.register<IEntityController>('EntityController', { useClass: EntityController });
container.register<IPaymentController>('PaymentController', { useClass: PaymentController });
container.register<IProviderController>('ProviderController', { useClass: ProviderController });