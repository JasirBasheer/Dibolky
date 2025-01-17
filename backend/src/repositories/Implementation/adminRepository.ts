import Admin from '../../models/admin/adminModel'
import { IAdmin } from '../../shared/types/adminTypes'
import { IAdminRepository } from '../Interface/IAdminRepository'


export default class AdminRepository implements IAdminRepository {
        async findAdminWithMail(email: string): Promise<IAdmin | null> {
                return await Admin.findOne({ email: email })
        }

        async changePassword(id: string, password: string): Promise<IAdmin | null> {
                return await Admin.findOneAndUpdate(
                { _id: id }, 
                { $set: { password: password } }, 
                { new: true })
        }
}

