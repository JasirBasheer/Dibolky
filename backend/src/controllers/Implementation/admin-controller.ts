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
import { QueryParser } from "@/utils";

@injectable()
export class AdminController implements IAdminController {
  private _adminService: IAdminService;

  constructor(@inject("AdminService") adminService: IAdminService) {
    this._adminService = adminService;
  }

  verifyAdmin = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("Details Not Fount");
    console.log("reached here");
    const details = await this._adminService.verifyAdmin(
      req.details._id as string
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.VERIFIED, {
      details,
      role: "admin",
    });
  };

  getClients = async (req: Request, res: Response): Promise<void> => {
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._adminService.getAllClients(query);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  getTransactions = async (req: Request, res: Response): Promise<void> => {
    const query = QueryParser.parseFilterQuery(req.query);
    const response = await this._adminService.getTransactions(query);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, response);
  };

  getClient = async (
    req: Request<{ client_id: string }>,
    res: Response
  ): Promise<void> => {
    const { client_id } = req.params;
    const details = await this._adminService.getClient(client_id);
    if (!details) throw new NotFoundError("Client Not found");

    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details });
  };
}
