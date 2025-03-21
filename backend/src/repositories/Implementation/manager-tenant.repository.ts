import { BaseRepository } from "mern.common";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IManagerTenantRepository } from "../Interface/IManagerTenantRepository";
import { Schema } from "mongoose";

@injectable()
export default class ManagerTenantRepository extends BaseRepository<any> implements IManagerTenantRepository {
    private managerSchema: Schema;
    private modelName = 'manager';
    private models: Map<string, Model<any>> = new Map();

    constructor(
        @inject('manager_tenant_model') schema: Schema
    ) {
        super(null as unknown as Model<any>);
        this.managerSchema = schema;
    }
}