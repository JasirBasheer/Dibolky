import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { connectTenantDB } from "@/config/db.config";
import { ISocialUser } from "@/models";
import { ISocialUserRepository } from "../Interface";

@injectable()
export class SocialUserRepository extends BaseRepository<ISocialUser> implements ISocialUserRepository {
    private _socialUser: Schema;
    private _modelName = 'socialUser';
    private _models: Map<string, Model<ISocialUser>> = new Map();

    constructor(
        @inject('social_user_modal') schema: Schema
    ) {
        super(null as unknown as Model<ISocialUser>);
        this._socialUser = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<ISocialUser>> {
        if (this._models.has(orgId)) {
            return this._models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');
        let model: Model<ISocialUser> = connection.model<ISocialUser>(this._modelName, this._socialUser);
        this._models.set(orgId, model);
        return model;
    }

    async createUser(
        orgId:string,
        social_user: Partial<ISocialUser>
    ): Promise<ISocialUser> {
        const model = await this.getModel(orgId);
        const newSocialUser = new model(social_user)
        const createdUser = await newSocialUser.save()
        if(!createdUser)throw new CustomError("An unexpected error occured while creating user please try again later.",500)
        return createdUser 
    }

    async getUsers(
        orgId:string,
        userId: string,
        platform:string,
    ): Promise<ISocialUser[]> {
        const model = await this.getModel(orgId);
        return model.find({userId,platform})
    }

    async getUsersWithPageId(
        orgId:string,
        userId: string,
        platform:string,
        linkedPage?:string
    ): Promise<ISocialUser[]> {
        const model = await this.getModel(orgId);
        return model.find({userId,platform,linkedPage})
    }

}
