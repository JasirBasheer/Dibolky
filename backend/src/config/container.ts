import "reflect-metadata";
import { container } from "tsyringe";
import {IAuthenticationController} from '../controllers/Interface/IAuthenticationController'
import AuthenticationController from '../controllers/Implementation/authenticationController'
import AdminRepository from '../repositories/Implementation/adminRepository';
import { IAdminRepository } from '../repositories/Interface/IAdminRepository';
import { IAgencyRepository } from '../repositories/Interface/IAgencyRepository';
import AgencyRepository from '../repositories/Implementation/agencyRepository';
import { ICompanyRepository } from '../repositories/Interface/ICompanyRepository';
import CompanyRepository from '../repositories/Implementation/companyRepository';
import EmployeeRepository from '../repositories/Implementation/employeeRepository';
import { IEmployeeRepository } from '../repositories/Interface/IEmployeeRepository';
import EntityRepository from '../repositories/Implementation/entityRepository';
import { IEntityRepository } from '../repositories/Interface/IEntityRepository';
import PlanRepository from '../repositories/Implementation/planRepository';
import { IPlanRepository } from '../repositories/Interface/IPlanRepository';
import { IAdminService } from '../services/Interface/IAdminService';
import AdminService from '../services/Implementation/adminService';
import AgencyService from '../services/Implementation/agencyService';
import { IAgencyService } from '../services/Interface/IAgencyService';
import AuthenticationService from '../services/Implementation/authenticationService';
import { IAuthenticationService } from '../services/Interface/IAuthenticationService';
import CompanyService from '../services/Implementation/companyService';
import { ICompanyService } from '../services/Interface/ICompanyService';
import { IEmployeeService } from '../services/Interface/IEmployeeService';
import EmployeeService from '../services/Implementation/employeeService';
import { IEntityService } from '../services/Interface/IEntityService';
import EntityService from '../services/Implementation/entityService';
import PaymentService from '../services/Implementation/paymentService';
import { IPaymentService } from '../services/Interface/IPaymentService';
import { IAdminController } from '../controllers/Interface/IAdminController';
import AdminController from '../controllers/Implementation/adminController';
import { IAgencyController } from '../controllers/Interface/IAgencyController';
import AgencyController from '../controllers/Implementation/agencyController';
import { IEmployeeController } from '../controllers/Interface/IEmployeeController';
import EmployeeController from '../controllers/Implementation/employeeController';
import { IEntityController } from '../controllers/Interface/IEntityController';
import EntityController from '../controllers/Implementation/entityController';
import { IPaymentController } from '../controllers/Interface/IPaymentController';
import PaymentController from '../controllers/Implementation/paymentController';

//Repo Registeration
container.register<IAdminRepository>('AdminRepository', { useClass: AdminRepository });
container.register<IAgencyRepository>('AgencyRepository', { useClass: AgencyRepository });
container.register<ICompanyRepository>('CompanyRepository', { useClass: CompanyRepository });
container.register<IEmployeeRepository>('EmployeeRepository', { useClass: EmployeeRepository });
container.register<IEntityRepository>('EntityRepository', { useClass: EntityRepository });
container.register<IPlanRepository>('PlanRepository', { useClass: PlanRepository });



//Service Registeration
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });
container.register<IAdminService>('AdminService', { useClass: AdminService });
container.register<IAgencyService>('AgencyService', { useClass: AgencyService });
container.register<ICompanyService>('CompanyService', { useClass: CompanyService });
container.register<IEmployeeService>('EmployeeService', { useClass: EmployeeService });
container.register<IEntityService>('EntityService', { useClass: EntityService });
container.register<IPaymentService>('PaymentService', { useClass: PaymentService });



//Controller Registeration
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAgencyController>('AgencyController', { useClass: AgencyController });
container.register<IEmployeeController>('EmployeeController', { useClass: EmployeeController });
container.register<IEntityController>('EntityController', { useClass: EntityController });
container.register<IPaymentController>('PaymentController', { useClass: PaymentController });