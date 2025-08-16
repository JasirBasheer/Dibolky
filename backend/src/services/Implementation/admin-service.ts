import bcrypt from "bcryptjs";
import { IPlanRepository } from "../../repositories/Interface/IPlanRepository";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { IEntityRepository } from "../../repositories/Interface/IEntityRepository";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { inject, injectable } from "tsyringe";
import { IAdminService } from "../Interface/IAdminService";
import { NotFoundError, UnauthorizedError } from "mern.common";
import { IAdminType } from "../../types/admin";
import { ITransactionRepository } from "../../repositories/Interface/ITransactionRepository";
import { AdminMapper } from "@/mappers/admin/admin-mapper";
import { IAgencyType } from "@/types/agency";
import { AdminAgencyMapper } from "@/mappers/admin/agency-mapper";
import { IAgency } from "@/models/Interface/agency";
import { FilterType, QueryParser } from "@/utils";
import { ITransaction } from "@/models";

@injectable()
export class AdminService implements IAdminService {
  private _planRepository: IPlanRepository;
  private _adminRepository: IAdminRepository;
  private _entityRepository: IEntityRepository;
  private _agencyRepository: IAgencyRepository;
  private _transactionRepository: ITransactionRepository;

  constructor(
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("AdminRepository") adminRepository: IAdminRepository,
    @inject("EntityRepository") entityRepository: IEntityRepository,
    @inject("AgencyRepository") agencyRepository: IAgencyRepository,
    @inject("TransactionRepository")
    transactionRepository: ITransactionRepository
  ) {
    this._planRepository = planRepository;
    this._adminRepository = adminRepository;
    this._entityRepository = entityRepository;
    this._agencyRepository = agencyRepository;
    this._transactionRepository = transactionRepository;
  }

  async adminLoginHandler(email: string, password: string): Promise<string> {
    const admin = await this._adminRepository.findAdminWithMail(email);
    if (!admin) throw new NotFoundError("Admin Not found");
    let isValidPassword = await bcrypt.compare(password, admin.password!);
    if (!isValidPassword) throw new UnauthorizedError("Invalid credentials");
    return admin._id as string;
  }

  async verifyAdmin(admin_id: string): Promise<IAdminType> {
    const admin = await this._adminRepository.findAdminWithId(admin_id);
    if (!admin) throw new NotFoundError("Admin Not found");
    return AdminMapper.AdminDetails(admin);
  }

  async getClient(client_id: string): Promise<object> {
    let clientDetials;

    const details = await this._agencyRepository.findAgencyWithId(client_id);
    if (!details) throw new NotFoundError("Agency Not Found");
    const transactions =
      await this._transactionRepository.getTransactionsWithOrgId(
        details?.orgId
      );
    clientDetials = { details, transactions };

    return clientDetials as object;
  }

  async getAllClients(
    query: FilterType
  ): Promise<{ clients: IAgencyType[]; totalCount: number }> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["name", "email", "organizationName"],
    });
    const options = {
      page,
      limit,
      sort: sortBy ? ({ [sortBy]: sortOrder === "desc" ? -1 : 1 } as Record< string, 1 | -1 >) : {}};

    const result = await this._agencyRepository.getAllAgencies(filter, options);
    const clients = AdminAgencyMapper.AgencyMapper(result.data as IAgency[]);
    return { clients, totalCount: result.totalCount };
  }

    async getTransactions(
    query: FilterType
  ): Promise<{ transactions: ITransaction[]; totalCount: number }> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["email","paymentGateway","description"],
    });
    const options = {
      page,
      limit,
      sort: sortBy ? ({ [sortBy]: sortOrder === "desc" ? -1 : 1 } as Record< string, 1 | -1 >) : {}};

    const result = await this._transactionRepository.getTransactions(filter,options)
    return { transactions: result.data, totalCount: result.totalCount };
  }
}
