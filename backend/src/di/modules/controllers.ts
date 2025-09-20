import { AdController, AdminController, AgencyController, AuthenticationController, ChatController, ClientController, EntityController, IAdController, IAdminController, IAgencyController, IAuthenticationController, IChatController, IClientController, IEntityController, IInboxController, InboxController, IPaymentController, IPlanController, IPortfolioController, IProjectController, IProviderController, IStorageController, ITransactionController, PaymentController, PlanController, PortfolioController, ProjectController, ProviderController, StorageController, TransactionController } from "@/controllers";
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
container.register<IInboxController>('InboxController', { useClass: InboxController });
container.register<IPortfolioController>('PortfolioController', { useClass: PortfolioController });
container.register<ITransactionController>('TransactionController', { useClass: TransactionController });
container.register<IStorageController>('StorageController', { useClass: StorageController });
container.register<IAdController>('AdController', { useClass: AdController });
container.register<IChatController>('ChatController', { useClass: ChatController });
container.register<IProjectController>('ProjectController', { useClass: ProjectController });
};
