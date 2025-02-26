import { IAgency, IReviewBucket } from '../../shared/types/agency.types';
import { IAgencyRepository } from '../Interface/IAgencyRepository';
import { BaseRepository, NotFoundError } from 'mern.common';
import { Model } from 'mongoose';
import { inject, injectable } from 'tsyringe';
import agencyModel from '../../models/agency/agency.model';


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
        agency_Id: string,
        password: string
    ): Promise<IAgency | null> {
        return this.update(
            { _id: agency_Id },
            { $set: { password } },
            { new: true }
        );
    }

    async getAgencyPlanConsumers(
        plan_id: string
    ): Promise<IAgency[] | null> {
        return await agencyModel.find({ planId: plan_id }).lean();
    }

}

