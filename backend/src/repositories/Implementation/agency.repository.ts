import { IAgency } from '../../types/agency.types';
import { IAgencyRepository } from '../Interface/IAgencyRepository';
import { BaseRepository, NotFoundError } from 'mern.common';
import { Model } from 'mongoose';
import { inject, injectable } from 'tsyringe';
import agencyModel from '../../models/agency.model';
import { IUpdateProfile } from '../../types/common.types';


@injectable()
export class AgencyRepository extends BaseRepository<IAgency> implements IAgencyRepository {

    constructor(
        @inject('agency_model') model: Model<IAgency>
    ) {
        super(model);
    }

    async findAgencyWithMail(
        agency_mail: string
    ): Promise<IAgency | null> {
        return this.findOne({ email: agency_mail });
    }

    async findAgencyWithId(
        agency_id: string
    ): Promise<IAgency | null> {
        return this.findOne({ _id: agency_id });
    }

    async findAgencyWithOrgId(
        orgId: string
    ): Promise<IAgency | null> {
        return this.findOne({ orgId });
    }

    async changePassword(
        agency_id: string,
        password: string
    ): Promise<IAgency | null> {
        return this.update(
            { _id: agency_id },
            { $set: { password } },
            { new: true }
        );
    }

    async getAgencyPlanConsumers(
        plan_id: string
    ): Promise<IAgency[] | null> {
        return await agencyModel.find({ planId: plan_id }).lean();
    }

    async updateProfile(
        orgId: string,
        details: IUpdateProfile
    ): Promise<IAgency | null> {
        return await this.update(
            { orgId: orgId },
            {
                profile: details.profile,
                name: details.name,
                bio: details.bio
            },
            { new: true }
        );
    }


}

