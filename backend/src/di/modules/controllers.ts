import { AdminController, AgencyController, AuthenticationController, ClientController, EntityController, IAdminController, IAgencyController, IAuthenticationController, IClientController, IEntityController, IInboxWebHookController, InboxWebhookController, IPaymentController, IPlanController, IPortfolioController, IProviderController, ITransactionController, PaymentController, PlanController, PortfolioController, ProviderController, TransactionController } from "@/controllers";
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
};
