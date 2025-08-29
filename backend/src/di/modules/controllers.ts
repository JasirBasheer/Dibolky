import { AdminController, AgencyController, AuthenticationController, ClientController, EntityController, IAdController, IAdminController, IAgencyController, IAuthenticationController, IClientController, IEntityController, IInboxWebHookController, InboxWebhookController, IPaymentController, IPlanController, IPortfolioController, IProviderController, IStorageController, ITransactionController, PaymentController, PlanController, PortfolioController, ProviderController, StorageController, TransactionController } from "@/controllers";
import { AdController } from "@/controllers/Implementation/ad-controller";
import { container } from "tsyringe";

export const registerControllers = () => {
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAgencyController>('AgencyController', { useClass: AgencyController });
container.register<IClientController>('ClientController', { useClass: ClientController });
container.register<IEntityController>('EntityController', { useClass: EntityController });
container.register<IPaymentController>('PaymentController', { useClass: PaymentController });
container.register<IProviderController>('ProviderController', { useClass: ProviderController });
container.register<IPlanController>('PlanController', { useClass: PlanController });
container.register<IInboxWebHookController>('InboxWebHookController', { useClass: InboxWebhookController });
container.register<IPortfolioController>('PortfolioController', { useClass: PortfolioController });
container.register<ITransactionController>('TransactionController', { useClass: TransactionController });
container.register<IStorageController>('StorageController', { useClass: StorageController });
container.register<IAdController>('AdController', { useClass: AdController });
};
