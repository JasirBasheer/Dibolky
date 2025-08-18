import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { IActivityRepository } from "../Interface/IActivityRepository";
import { IActivity } from "@/models";
import { connectTenantDB } from "@/config/db.config";
import { IActivityType } from "@/types";

@injectable()
export class ActivityRepository extends BaseRepository<IActivity> implements IActivityRepository {
    private _clientSchema: Schema;
    private _modelName = 'activitie';
    private _models: Map<string, Model<IActivity>> = new Map();

    constructor(
        @inject('activity_modal') schema: Schema
    ) {
        super(null as unknown as Model<IActivity>);
        this._clientSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<IActivity>> {
        if (this._models.has(orgId)) {
            return this._models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');
        let model: Model<IActivity> = connection.model<IActivity>(this._modelName, this._clientSchema);
        this._models.set(orgId, model);
        return model;
    }

    async createActivity(
        orgId:string,
        activity:Partial<IActivityType>
    ): Promise<void> {
        const model = await this.getModel(orgId);

        const newActivity = new model(activity)
        const createdActivity = await newActivity.save()
        if(!createdActivity)throw new CustomError("An unexpected error occured while creating activity please try again later.",500)
    }

    async getActivities(
        options: { orgId: string; userId?: string; activityType?: string; limit?: number; skip?: number }
    ): Promise<IActivity[]> {
        const model = await this.getModel(options.orgId);
        return await model.find({}).sort({ timestamp: -1 })
    }

    async getActivitiesByUserId(
        orgId: string,
        user_id: string
    ): Promise<IActivity[] | null> {
        const model = await this.getModel(orgId);
        return await model.find({"user.userId":user_id})
    }
}
