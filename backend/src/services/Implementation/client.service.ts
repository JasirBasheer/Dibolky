import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IClientService } from "../Interface/IClientService";
import { NotFoundError, UnauthorizedError, comparePassword } from "mern.common";
import { clientSchema } from "../../models/agency/clientModel";
import { exchangeForLongLivedToken } from "../../provider.strategies/instagram.strategy";

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

  async saveClientSocialMediaTokens(id: string, provider: string, token: string, db?: any): Promise<any> {
    console.log(token,"sortformmmmmmmmmmmmmmmmmmmmmmmmmm")
    token = await exchangeForLongLivedToken(token)
    console.log(token,"long formmmmmmmmmmmmmmmmmmmmmmmmmm")
    
    const database = db.model('clients', clientSchema)
    return await this.clientRepository.setSocialMediaTokens(id, provider, token, database)

  }

}
