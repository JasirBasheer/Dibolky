import { IInfluencer } from "../../types/influencer";

export interface IInfluencerService {
    influencerLoginHandler(email: string, password: string): Promise<string>;
    verifyInfluencer(influencer_id:string):Promise<IInfluencer | null>
}
