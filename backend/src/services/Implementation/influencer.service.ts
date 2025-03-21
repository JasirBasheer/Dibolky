import { inject, injectable } from "tsyringe";
import { IInfluencerService } from "../Interface/IInfluencerService";
import { IInfluencerRepository } from "../../repositories/Interface/IInfluencerRepository";
import { IInfluencerTenantRepository } from "../../repositories/Interface/IInfluencerTenantRepository";
import { NotFoundError, UnauthorizedError } from "mern.common";
import bcrypt from 'bcrypt'
import { IInfluencer } from "../../types/influencer.types";

@injectable()
export default class InfluencerService implements IInfluencerService {
    private influencerRepository : IInfluencerRepository;
    private influencerTenantRepository : IInfluencerTenantRepository;
    constructor(
        @inject('InfluencerRepository') influencerRepository: IInfluencerRepository,
        @inject('InfluencerTenantRepository') influencerTenantRepository: IInfluencerTenantRepository
    ) {
        this.influencerRepository = influencerRepository
        this.influencerTenantRepository = influencerTenantRepository
    }

    async influencerLoginHandler(
        email: string, 
        password: string
    ): Promise<string>{
        const influencer = await this.influencerRepository.findInfluencerWithMail(email)
        if(!influencer)throw new NotFoundError("Influencer not found")
        if(influencer.isBlocked)throw new UnauthorizedError("Account is blocked")

        const isPasswordValid = await bcrypt.compare(password,influencer.password)
        if(!isPasswordValid)throw new UnauthorizedError('Invalid credentials')
        return influencer._id as string
    }
    
    async verifyInfluencer(
        influencer_id:string
    ):Promise<IInfluencer | null>{
        return await this.influencerRepository.findInfluencerWithId(influencer_id)
    }

}



