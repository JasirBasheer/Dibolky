import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IClientService } from "../Interface/IClientService";
import { NotFoundError, UnauthorizedError, comparePassword } from "mern.common";
import { clientSchema } from "../../models/agency/client.model";
import { exchangeForLongLivedToken } from "../../provider.strategies/instagram.strategy";
import { ReviewBucketSchema } from "../../models/agency/review-bucket.model";
import { ownerDetailsSchema } from "../../models/agency/agency.model";

@injectable()
export default class ClientService implements IClientService {
  private clientRepository: IClientRepository;

  constructor(
    @inject('ClientRepository') clientRepository: IClientRepository,

  ) {
    this.clientRepository = clientRepository
  }

  async clientLoginHandler(email: string, password: string): Promise<any> {
    const clientDetails = await this.clientRepository.findClientWithMail(email);
    if (!clientDetails) throw new NotFoundError('Account not found');
    if (clientDetails?.isBlocked) throw new UnauthorizedError('Account is blocked');

    const isValid = await comparePassword(password, clientDetails.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    return clientDetails._id
  }

  async verifyClient(id: string): Promise<any> {
    return await this.clientRepository.findClientWithId(id)
  }

  async getClientDetails(tenantDb:any,email:string):Promise<any>{
    tenantDb = await tenantDb.model('clients',clientSchema)
    return await this.clientRepository.getClientDetailsByMail(tenantDb,email)
  }

  async getOwners(tenantDb:any):Promise<any>{
    const ownerSchema = await tenantDb.model('OwnerDetail',ownerDetailsSchema)
    return await this.clientRepository.getOwnerDetails(ownerSchema)
  }


  async saveClientSocialMediaTokens(id: string, provider: string, token: string, db?: any): Promise<any> {
    token = await exchangeForLongLivedToken(token)
    const database = db.model('clients', clientSchema)
    return await this.clientRepository.setSocialMediaTokens(id, provider, token, database)

  }

  async setSocialMediaUserNames(id: string, provider: string, username: string, db?: any): Promise<any> {
    const database = db.model('clients', clientSchema)
    return await this.clientRepository.setSocialMediaUserNames(id, provider, username, database)
  }

  async getReviewBucket(clientId: string, tenantDb: any): Promise<any> {
    const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
    return await this.clientRepository.getReviewBucketById(clientId, db)
  }

  async getClientInMainDb(email:string):Promise<any>{
    const client = await this.clientRepository.getClientInMainDb(email)
    return client
  }

}
