import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { IAdController } from "../Interface/IAdController";
import { IAdService } from "@/services";

@injectable()
export class AdController implements IAdController {
    constructor(
      @inject("AdService") private readonly _adService: IAdService
    ) {}

  getCampaigns = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const selectedPlatforms = Array.isArray(req.query.selectedPlatforms)
      ? req.query.selectedPlatforms.map(String)
      : req.query.selectedPlatforms
      ? [String(req.query.selectedPlatforms)]
      : [];

    const selectedAdAccounts = Array.isArray(req.query.selectedAdAccounts)
      ? req.query.selectedAdAccounts.map(String)
      : req.query.selectedAdAccounts
      ? [String(req.query.selectedAdAccounts)]
      : [];

    const campaigns = await this._adService.getAllCampaigns(
      req.details.orgId,
      role,
      userId,
      selectedPlatforms,
      selectedAdAccounts
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      campaigns,
    });
  };

  createCampaign = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    // const selectedPlatforms = Array.isArray(req.query.selectedPlatforms) ? req.query.selectedPlatforms.map(String)
    // SendResponse(res,HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { campaigns });
  };

  getAdSets = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const { id, platform } = req.query as { id: string; platform: string };
    const adsets = await this._adService.getAllAdSets(
      req.details.orgId,
      role,
      userId,
      id,
      platform
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { adsets });
  };

  createAdSet = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const { id, platform } = req.query as { id: string; platform: string };
    const adsets = await this._adService.getAllAdSets(
      req.details.orgId,
      role,
      userId,
      id,
      platform
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { adsets });
  };

  getAllAds = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const { adsetId, platform } = req.query as {
      adsetId: string;
      platform: string;
    };

    const ads = await this._adService.getAllAds(
      req.details.orgId,
      role,
      userId,
      adsetId,
      platform
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ads });
  };

  createAd = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const { adsetId, platform } = req.query as {
      adsetId: string;
      platform: string;
    };

    const ads = await this._adService.createAd(
      req.details.orgId,
      role,
      userId,
      adsetId,
      platform
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ads });
  };
}
