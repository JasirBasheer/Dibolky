import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IClientService } from "../Interface/IClientService";
import { CustomError, NotFoundError, UnauthorizedError, comparePassword } from "mern.common";
import { IClientType } from "../../types/client";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IAgencyTenant } from "../../types/agency";
import { IClient } from "@/models/Interface/client";
import { ClientMapper } from "@/mappers/client/client-mapper";
import { IClientTenant } from "@/models";

@injectable()
export default class ClientService implements IClientService {
  private _clientRepository: IClientRepository;
  private _clientTenantRepository: IClientTenantRepository
  private _contentRepository: IContentRepository
  private _agencyTenantRepository: IAgencyTenantRepository

  constructor(
    @inject('ClientRepository') clientRepository: IClientRepository,
    @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
    @inject('ContentRepository') contentRepository: IContentRepository,
    @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
    

  ) {
    this._clientRepository = clientRepository
    this._clientTenantRepository = clientTenantRepository
    this._contentRepository = contentRepository
    this._agencyTenantRepository = agencyTenantRepository
  }

  async clientLoginHandler(
    email: string,
    password: string
  ): Promise<string> {
    const clientDetails = await this._clientRepository.findClientWithMail(email);
    if (!clientDetails) throw new NotFoundError('Account not found');
    if (clientDetails?.isBlocked) throw new UnauthorizedError('Account is blocked');

    const isValid = await comparePassword(password, clientDetails.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    return clientDetails._id as string
  }

  async verifyClient(
    client_id: string
  ): Promise<Partial<IClientType> | null>{
    const client = await this._clientRepository.findClientWithId(client_id)
    return ClientMapper.ClientDetailsMapper(client as IClient)
  }

  async getClientDetails(
    orgId: string,
    email: string
  ): Promise<IClientTenant | null> {
    return await this._clientTenantRepository.getClientDetailsByMail(orgId, email)
  }

  async getClientTenantDetailsById(
    orgId: string,
    client_id: string
  ): Promise<IClientTenant | null> {
    return await this._clientTenantRepository.getClientById(orgId, client_id)
  }


  async getOwners(
    orgId: string
  ): Promise<IAgencyTenant[] | null> {
    return await this._agencyTenantRepository.getOwners(orgId)
  }



  async getClientInMainDb(
    email: string
  ): Promise<IClient | null> {
    const client = await this._clientRepository.findClientWithMail(email)
    return client
  }

}
