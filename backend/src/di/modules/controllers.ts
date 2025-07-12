import { container } from "tsyringe";
import { IManagerController } from "@/controllers/Interface/IManagerController";
import ManagerController from "@/controllers/Implementation/manager.controller";
import { IClientController } from "@/controllers/Interface/IClientController";
import ClientController from "@/controllers/Implementation/client.controller";
import { IProviderController } from "@/controllers/Interface/IProviderController";
import ProviderController from "@/controllers/Implementation/provider.controller";
import { IAdminController } from '@/controllers/Interface/IAdminController';
import AdminController from '@/controllers/Implementation/admin.controller';
import { IAgencyController } from '@/controllers/Interface/IAgencyController';
import AgencyController from '@/controllers/Implementation/agency.controller';
import { IEntityController } from '@/controllers/Interface/IEntityController';
import EntityController from '@/controllers/Implementation/entity.controller';
import { IPaymentController } from '@/controllers/Interface/IPaymentController';
import PaymentController from '@/controllers/Implementation/payment.controller';
import { IAuthenticationController } from '@/controllers/Interface/IAuthenticationController'
import AuthenticationController from '@/controllers/Implementation/authentication.controller'
import { IPlanController } from "@/controllers/Interface/IPlanController";
import PlanController from "@/controllers/Implementation/plan-controller";

export const registerControllers = () => {
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAgencyController>('AgencyController', { useClass: AgencyController });
container.register<IClientController>('ClientController', { useClass: ClientController });
container.register<IEntityController>('EntityController', { useClass: EntityController });
container.register<IPaymentController>('PaymentController', { useClass: PaymentController });
container.register<IProviderController>('ProviderController', { useClass: ProviderController });
container.register<IManagerController>('ManagerController', { useClass: ManagerController });
container.register<IPlanController>('PlanController', { useClass: PlanController });
};
