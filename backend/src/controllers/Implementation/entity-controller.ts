import { Request, Response } from "express";
import { IEntityController } from "../Interface/IEntityController";
import { IEntityService } from "../../services/Interface/IEntityService";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { QueryParser } from "@/utils/query-parser";

@injectable()
export class EntityController implements IEntityController {
  private _entityService: IEntityService;

  constructor(@inject("EntityService") entityService: IEntityService) {
    this._entityService = entityService;
  }

  getMedia = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id } = req.params;
    const { selectedPlatforms, selectedPages } = req.body;
    const contents = await this._entityService.getMedia(
      req.details.orgId as string,
      entity,
      user_id,
      selectedPlatforms,
      selectedPages
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      contents,
    });
  };

  getAllInvoices = async (req: Request, res: Response): Promise<void> => {
    const { user_id, entity } = req.params;
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._entityService.getAllInvoices(
      req.details.orgId,
      entity,
      user_id,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    const { user_id, entity } = req.params;
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._entityService.getAllTransactions(
      req.details.orgId,
      entity,
      user_id,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  getAllActivities = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id } = req.params;
    const result = await this._entityService.getAllActivities(
      req.details.orgId,
      entity,
      user_id
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { result });
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { role, details } = req.body;
    const updatedProfile = await this._entityService.updateProfile(
      req.details.orgId as string,
      role,
      req.details?.role as string,
      details
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      details: updatedProfile,
    });
  };

  getCalenderEvents = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const events = await this._entityService.getCalenderEvents(
      req.details.orgId,
      role,
      userId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { events });
  };
}
