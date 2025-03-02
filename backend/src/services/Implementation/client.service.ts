import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IClientService } from "../Interface/IClientService";
import { CustomError, NotFoundError, UnauthorizedError, comparePassword } from "mern.common";
import { IClient, IClientTenant } from "../../shared/types/client.types";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IAgencyTenant } from "../../shared/types/agency.types";

@injectable()
export default class ClientService implements IClientService {
  private clientRepository: IClientRepository;
  private clientTenantRepository: IClientTenantRepository
  private contentRepository: IContentRepository
  private agencyTenantRepository: IAgencyTenantRepository

  constructor(
    @inject('ClientRepository') clientRepository: IClientRepository,
    @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
    @inject('ContentRepository') contentRepository: IContentRepository,
    @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
    

  ) {
    this.clientRepository = clientRepository
    this.clientTenantRepository = clientTenantRepository
    this.contentRepository = contentRepository
    this.agencyTenantRepository = agencyTenantRepository
  }

  async clientLoginHandler(
    email: string,
    password: string
  ): Promise<string> {
    const clientDetails = await this.clientRepository.findClientWithMail(email);
    if (!clientDetails) throw new NotFoundError('Account not found');
    if (clientDetails?.isBlocked) throw new UnauthorizedError('Account is blocked');

    const isValid = await comparePassword(password, clientDetails.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    return clientDetails._id as string
  }

  async verifyClient(
    client_id: string
  ): Promise<IClient | null> {
    return await this.clientRepository.findClientWithId(client_id)
  }

  async getClientDetails(
    orgId: string,
    email: string
  ): Promise<IClientTenant | null> {
    return await this.clientTenantRepository.getClientDetailsByMail(orgId, email)
  }

  async getClientTenantDetailsById(
    orgId: string,
    client_id: string
  ): Promise<IClientTenant | null> {
    return await this.clientTenantRepository.getClientById(orgId, client_id)
  }


  async getOwners(
    orgId: string
  ): Promise<IAgencyTenant[] | null> {
    return await this.agencyTenantRepository.getOwners(orgId)
  }



  async getClientInMainDb(
    email: string
  ): Promise<IClient | null> {
    const client = await this.clientRepository.findClientWithMail(email)
    return client
  }

}
