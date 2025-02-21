import { BaseRepository } from "mern.common";
import { IClient } from "../../shared/types/client.types";
import { IClientRepository } from "../Interface/IClientRepository";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";

@injectable()
export default class ClientRepository extends BaseRepository<IClient> implements IClientRepository {
    constructor(
        @inject('client_model') model: Model<IClient>
    ) {
        super(model);
    }

    async findClientWithMail(
        email: string
    ): Promise<IClient | null> {
        return await this.findOne({ email: email });
    }

    async findClientWithId(
        client_id: string
    ): Promise<IClient | null> {
        return await this.findOne({ _id: client_id });
    }

    async createClient(
        newClient: IClient
    ): Promise<IClient | null> {
        return await this.create(newClient)
    }

}

