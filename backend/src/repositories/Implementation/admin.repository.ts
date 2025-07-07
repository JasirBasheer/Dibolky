import { IAdminRepository } from '../Interface/IAdminRepository';
import { BaseRepository } from 'mern.common';
import { IAdmin } from '../../types/admin';
import { Model } from 'mongoose';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor(
        @inject('admin_model') model: Model<IAdmin>
    ) {
        super(model);
    }

    async findAdminWithMail(
        email: string
    ): Promise<IAdmin | null> {
        return await this.findOne({ email });
    }

    async findAdminWithId(
        admin_id: string
    ): Promise<IAdmin | null> {
        return await this.findOne({ _id: admin_id });
    }
    
    async changePassword(
        admin_id: string, 
        password: string
    ): Promise<IAdmin | null> {
        return await this.update(
            { _id: admin_id }, 
            { $set: { password } }, 
            { new: true }
        );
    }
}