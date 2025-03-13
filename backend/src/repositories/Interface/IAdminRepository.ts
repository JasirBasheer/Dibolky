import { IBaseRepository } from 'mern.common';
import { IAdmin } from '../../types/admin.types';

export interface IAdminRepository extends IBaseRepository<IAdmin> {
    findAdminWithMail(email: string): Promise<IAdmin | null>;
    findAdminWithId(admin_id: string): Promise<IAdmin | null>;
    changePassword(admin_id: string, password: string): Promise<IAdmin | null>;
}