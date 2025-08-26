import bcrypt from "bcryptjs";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { inject, injectable } from "tsyringe";
import { IAdminService } from "../Interface/IAdminService";
import { NotFoundError, UnauthorizedError } from "mern.common";
import { IAdminType } from "../../types/admin";
import { AdminMapper } from "@/mappers/admin/admin-mapper";

@injectable()
export class AdminService implements IAdminService {

  constructor(
    @inject("AdminRepository") private readonly _adminRepository: IAdminRepository,
  ) {}

  async adminLoginHandler(email: string, password: string): Promise<string> {
    const admin = await this._adminRepository.findAdminWithMail(email);
    if (!admin) throw new NotFoundError("Admin Not found");
    let isValidPassword = await bcrypt.compare(password, admin.password!);
    if (!isValidPassword) throw new UnauthorizedError("Invalid credentials");
    return admin._id as string;
  }

  async verifyAdmin(admin_id: string): Promise<IAdminType> {
    const admin = await this._adminRepository.findAdminWithId(admin_id);
    if (!admin) throw new NotFoundError("Admin Not found");
    return AdminMapper.AdminDetails(admin);
  }


}
