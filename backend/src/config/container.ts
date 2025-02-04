import "reflect-metadata";
import { container } from "tsyringe";
import {IAuthenticationController} from '../controllers/Interface/IAuthenticationController'
import AuthenticationController from '../controllers/Implementation/authentication.controller'
import AdminRepository from '../repositories/Implementation/admin.repository';
import { IAdminRepository } from '../repositories/Interface/IAdminRepository';
import { IAgencyRepository } from '../repositories/Interface/IAgencyRepository';
import AgencyRepository from '../repositories/Implementation/agency.repository';
import { ICompanyRepository } from '../repositories/Interface/ICompanyRepository';
import CompanyRepository from '../repositories/Implementation/company.repository';
import EmployeeRepository from '../repositories/Implementation/employee.repository';
import { IEmployeeRepository } from '../repositories/Interface/IEmployeeRepository';
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
import CompanyService from '../services/Implementation/company.service';
import { ICompanyService } from '../services/Interface/ICompanyService';
import { IEmployeeService } from '../services/Interface/IEmployeeService';
import EmployeeService from '../services/Implementation/employee.service';
import { IEntityService } from '../services/Interface/IEntityService';
import EntityService from '../services/Implementation/entity.service';
import PaymentService from '../services/Implementation/payment.service';
import { IPaymentService } from '../services/Interface/IPaymentService';
import { IAdminController } from '../controllers/Interface/IAdminController';
import AdminController from '../controllers/Implementation/admin.controller';
import { IAgencyController } from '../controllers/Interface/IAgencyController';
import AgencyController from '../controllers/Implementation/agency.controller';
import { IEmployeeController } from '../controllers/Interface/IEmployeeController';
import EmployeeController from '../controllers/Implementation/employee.controller';
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



//* Repo Registeration
container.register<IAdminRepository>('AdminRepository', { useClass: AdminRepository });
container.register<IAgencyRepository>('AgencyRepository', { useClass: AgencyRepository });
container.register<ICompanyRepository>('CompanyRepository', { useClass: CompanyRepository });
container.register<IEmployeeRepository>('EmployeeRepository', { useClass: EmployeeRepository });
container.register<IEntityRepository>('EntityRepository', { useClass: EntityRepository });
container.register<IPlanRepository>('PlanRepository', { useClass: PlanRepository });
container.register<IClientRepository>('ClientRepository', { useClass: ClientRepository });



//* Service Registeration
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });
container.register<IAdminService>('AdminService', { useClass: AdminService });
container.register<IAgencyService>('AgencyService', { useClass: AgencyService });
container.register<ICompanyService>('CompanyService', { useClass: CompanyService });
container.register<IEmployeeService>('EmployeeService', { useClass: EmployeeService });
container.register<IEntityService>('EntityService', { useClass: EntityService });
container.register<IPaymentService>('PaymentService', { useClass: PaymentService });
container.register<IClientService>('ClientService', { useClass: ClientService });
container.register<IProviderService>('ProviderService', { useClass: ProviderService });




//* Controller Registeration
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAgencyController>('AgencyController', { useClass: AgencyController });
container.register<IEmployeeController>('EmployeeController', { useClass: EmployeeController });
container.register<IEntityController>('EntityController', { useClass: EntityController });
container.register<IPaymentController>('PaymentController', { useClass: PaymentController });
container.register<IClientController>('ClientController', { useClass: ClientController });
container.register<IProviderController>('ProviderController', { useClass: ProviderController });