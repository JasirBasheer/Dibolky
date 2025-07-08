import bcrypt from "bcryptjs";
import { IPlanRepository } from "../../repositories/Interface/IPlanRepository";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { IEntityRepository } from "../../repositories/Interface/IEntityRepository";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { inject, injectable } from "tsyringe";
import { IAdminService } from "../Interface/IAdminService";
import { CustomError, NotFoundError, UnauthorizedError } from "mern.common";
import { IAdmin, IPlan, Plans } from "../../types/admin";
import { ITransactionRepository } from "../../repositories/Interface/ITransactionRepository";
import { createNewPlanMenu } from "../../utils/menu.utils";
import { ROLES } from "../../utils/constants.utils";
import { PlanDetailsDTO } from "@/dto";

@injectable()
export default class AdminService implements IAdminService {
  private planRepository: IPlanRepository;
  private adminRepository: IAdminRepository;
  private entityRepository: IEntityRepository;
  private agencyRepository: IAgencyRepository;
  private transactionRepository: ITransactionRepository;

  constructor(
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("AdminRepository") adminRepository: IAdminRepository,
    @inject("EntityRepository") entityRepository: IEntityRepository,
    @inject("AgencyRepository") agencyRepository: IAgencyRepository,
    @inject("TransactionRepository")
    transactionRepository: ITransactionRepository
  ) {
    this.planRepository = planRepository;
    this.adminRepository = adminRepository;
    this.entityRepository = entityRepository;
    this.agencyRepository = agencyRepository;
    this.transactionRepository = transactionRepository;
  }

  async adminLoginHandler(email: string, password: string): Promise<string> {
    const admin = await this.adminRepository.findAdminWithMail(email);
    if (!admin) throw new NotFoundError("Admin Not found");
    let isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) throw new UnauthorizedError("Invalid credentials");
    return admin._id as string;
  }

  async verifyAdmin(admin_id: string): Promise<IAdmin> {
    const admin = await this.adminRepository.findAdminWithId(admin_id);
    if (!admin) throw new NotFoundError("Admin Not found");
    return admin;
  }


  async getRecentClients(): Promise<object> {
    let agencies = await this.entityRepository.getAllRecentAgencyOwners();
    let result = { Agency: agencies };
    return result;
  }

  async getClient(client_id: string): Promise<object> {
    let clientDetials;
    
      const details = await this.agencyRepository.findAgencyWithId(client_id);
      if (!details) throw new NotFoundError("Agency Not Found");
      const transactions =
        await this.transactionRepository.getTransactionsWithOrgId(
          details?.orgId
        );
      clientDetials = { details, transactions };
    
    return clientDetials as object;
  }

  async getAllClients(): Promise<object | null> {
    let agencies = await this.entityRepository.getAllAgencyOwners();
    let result = { Agency: agencies };
    return result;
  }

 
}
