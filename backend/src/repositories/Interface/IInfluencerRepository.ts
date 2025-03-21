import { IInfluencer } from "../../types/influencer.types";

export interface IInfluencerRepository {
    findInfluencerWithMail(influencer_mail: string): Promise<IInfluencer | null>
    findInfluencerWithId(influencer_id: string): Promise<IInfluencer | null>
    changePassword(influencer_id: string, password: string): Promise<IInfluencer | null>;

}