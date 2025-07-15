import { container } from "tsyringe";
import { ActivityRepository, AdminRepository, AgencyRepository, AgencyTenantRepository, ChatRepository, ClientRepository, ClientTenantRepository, ContentRepository, EntityRepository, IActivityRepository, IAdminRepository, IAgencyRepository, IAgencyTenantRepository, IChatRepository, IClientRepository, IClientTenantRepository, IContentRepository, IEntityRepository, IMessageRepository, INoteRepository, IPlanRepository, IProjectRepository, ITransactionRepository, MessageRepository, NoteRepository, PlanRepository, ProjectRepository, TransactionRepository } from "@/repositories";

export const registerRepositories = () => {
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
container.register<INoteRepository>('NoteRepository', { useClass: NoteRepository });
container.register<IActivityRepository>('ActivityRepository', { useClass: ActivityRepository });
};
