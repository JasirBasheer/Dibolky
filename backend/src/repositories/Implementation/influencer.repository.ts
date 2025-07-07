import { inject, injectable } from 'tsyringe';
import { Model } from 'mongoose';
import { BaseRepository } from 'mern.common';
import { IInfluencerRepository } from '../Interface/IInfluencerRepository';
import { IInfluencer } from '../../types/influencer';

@injectable()
export default class InfluencerRepository extends BaseRepository<IInfluencer> implements IInfluencerRepository {
        constructor(
                @inject('influencer_model') model: Model<IInfluencer>
        ) {
                super(model);
        }

        async findInfluencerWithMail(
                influencer_mail: string
        ): Promise<IInfluencer | null> {
                return this.findOne({ email: influencer_mail })
        }

        async findInfluencerWithId(
                influencer_id: string
        ): Promise<IInfluencer | null> {
                return this.findOne({ _id: influencer_id })
        }

        async changePassword(
                influencer_id: string,
                password: string
        ): Promise<IInfluencer | null> {
                return this.update(
                        { _id: influencer_id },
                        { $set: { password } },
                        { new: true }
                );
        }

}