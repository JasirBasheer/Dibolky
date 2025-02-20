import { IAdminRepository } from '../Interface/IAdminRepository';
import { BaseRepository } from 'mern.common';
import { IAdmin } from '../../shared/types/admin.types';
import { Model } from 'mongoose';
import { inject, injectable } from 'tsyringe';
import Admin from '../../models/admin/admin.model';

injectable()
export default class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
        async findAdminWithMail(email: string): Promise<IAdmin | null> {
                return await Admin.findOne({ email: email })
        }
        async findAdminWithId(id: string): Promise<IAdmin | null> {
                return await Admin.findOne({ _id: id })
        }
        
        async changePassword(id: string, password: string): Promise<IAdmin | null> {
                return await Admin.findOneAndUpdate(
                { _id: id }, 
                { $set: { password: password } }, 
                { new: true })
        }

}