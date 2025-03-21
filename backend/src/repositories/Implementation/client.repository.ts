import { BaseRepository } from "mern.common";
import { IClient } from "../../types/client.types";
import { IClientRepository } from "../Interface/IClientRepository";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IUpdateProfile } from "../../types/common.types";

@injectable()
export default class ClientRepository extends BaseRepository<IClient> implements IClientRepository {
    constructor(
        @inject('client_model') model: Model<IClient>
    ) {
        super(model);
    }

    async findClientWithMail(
        client_mail: string
    ): Promise<IClient | null> {
        return await this.findOne({ email: client_mail });
    }

    async findClientWithId(
        client_id: string
    ): Promise<IClient | null> {
        return await this.findOne({ _id: client_id });
    }

    async changePassword(
        client_id: string,
        password: string
    ): Promise<IClient | null> {
        return this.update(
            { _id: client_id },
            { $set: { password } },
            { new: true }
        );
    }

    async createClient(
        newClient: IClient
    ): Promise<IClient | null> {
        return await this.create(newClient)
    }

    async updateProfile(
        details: IUpdateProfile
    ): Promise<IClient | null> {
        return await this.update(
            { _id: details.main_id },
            {
                profile: details.profile,
                name: details.name,
                bio: details.bio
            },
            { new: true }
        )
    }


}

