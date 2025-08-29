import { container } from "tsyringe";
import { AdminService, AgencyService, AuthenticationService, ChatService, ClientService, EntityService, IAdminService, IAgencyService, IAuthenticationService, IChatService, IClientService, IEntityService, IPaymentService, IPlanService, IPortfolioService, IProviderService, IStorageService, ITransactionService, PaymentService, PlanService, PortfolioService, ProviderService, TransactionService } from "@/services";
import { StorageService } from "@/services/Implementation/storage-service";
import { IStorageProvider, S3Provider } from "@/providers/storage";

export const registerServices = () => {
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });
container.register<IAdminService>('AdminService', { useClass: AdminService });
container.register<IAgencyService>('AgencyService', { useClass: AgencyService });
container.register<IEntityService>('EntityService', { useClass: EntityService });
container.register<IPaymentService>('PaymentService', { useClass: PaymentService });
container.register<IClientService>('ClientService', { useClass: ClientService });
container.register<IProviderService>('ProviderService', { useClass: ProviderService });
container.register<IChatService>('ChatService', { useClass: ChatService });
container.register<IPlanService>('PlanService', { useClass: PlanService });
container.register<IPortfolioService>('PortfolioService', { useClass: PortfolioService });
container.register<ITransactionService>('TransactionService', { useClass: TransactionService });
container.register<IStorageService>('StorageService', { useClass: StorageService });


// Provider for external storage (AWS S3)
container.register<IStorageProvider>('StorageProvider', { useClass: S3Provider });
};
