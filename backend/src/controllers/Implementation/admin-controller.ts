import { Request, Response } from "express";
import { IAdminController } from "../Interface/IAdminController";
import { inject, injectable } from "tsyringe";
import { IAdminService } from "../../services/Interface/IAdminService";
import {
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { QueryParser, ROLES } from "@/utils";

@injectable()
export class AdminController implements IAdminController {
  private _adminService: IAdminService;

  constructor(@inject("AdminService") adminService: IAdminService) {
    this._adminService = adminService;
  }

  verifyAdmin = async (req: Request, res: Response): Promise<void> => {
    const details = await this._adminService.verifyAdmin(req.details._id);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.VERIFIED, { details, role: ROLES.ADMIN });
  };

}
