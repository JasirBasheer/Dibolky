import { IBaseRepository } from 'mern.common';
import { IAdmin } from '../../shared/types/admin.types';

export interface IAdminRepository {
    findAdminWithMail(email: string): Promise<IAdmin | null>;
    findAdminWithId(id: string): Promise<IAdmin | null>;
    changePassword(id: string, password: string): Promise<IAdmin | null>;
}