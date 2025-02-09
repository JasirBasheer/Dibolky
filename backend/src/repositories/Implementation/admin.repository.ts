import { IAdminRepository } from '../Interface/IAdminRepository';
import { BaseRepository } from 'mern.common';
import { IAdmin } from '../../shared/types/admin.types';
import { Model } from 'mongoose';
import { inject, injectable } from 'tsyringe';

@injectable()

export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
        constructor(@inject('AdminModel') model: Model<IAdmin>) {
                super(model);
            }

        async findAdminWithMail(email: string): Promise<IAdmin | null> {
                return await this.findOne({ email });
        }

        async findAdminWithId(id: string): Promise<IAdmin | null> {
                return await this.findOne({ _id: id });
        }

        async changePassword(id: string, password: string): Promise<IAdmin | null> {
                return await this.update({ _id: id }, { $set: { password } }, { new: true });
        }
}