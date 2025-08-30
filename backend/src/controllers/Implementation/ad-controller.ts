import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { IAdController } from "../Interface/IAdController";
import { IAdService } from "@/services";
import { CreateCampaignSchema } from "@/dtos/campaign";

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
    
    // Validate request body
    const validationResult = CreateCampaignSchema.safeParse(req.body);
    if (!validationResult.success) {
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Validation failed", {
        errors: validationResult.error.issues,
      });
      return;
    }

    const campaignData = validationResult.data;
    
    try {
      const createdCampaign = await this._adService.createCampaign(
        req.details.orgId,
        role,
        userId,
        campaignData.adAccountId,
        campaignData.platform,
        campaignData
      );

      SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.SUCCESS, {
        campaign: createdCampaign,
      });
    } catch (error) {
      SendResponse(res, HTTPStatusCodes.INTERNAL_SERVER_ERROR, error.message, {
        error: error.message,
      });
    }
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

  deleteCampaign = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const { campaignId, platform } = req.body;

    if (!campaignId) {
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Campaign ID is required", {
        error: "Campaign ID is required",
      });
      return;
    }

    if (!platform) {
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Platform is required", {
        error: "Platform is required",
      });
      return;
    }

    try {
      await this._adService.deleteCampaign(
        req.details.orgId,
        role,
        userId,
        campaignId,
        platform
      );

      SendResponse(res, HTTPStatusCodes.OK, "Campaign deleted successfully", {
        message: "Campaign deleted successfully",
      });
    } catch (error) {
      SendResponse(res, HTTPStatusCodes.INTERNAL_SERVER_ERROR, error.message, {
        error: error.message,
      });
    }
  };

  toggleCampaignStatus = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const { campaignId, platform, currentStatus } = req.body;

    if (!campaignId) {
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Campaign ID is required", {
        error: "Campaign ID is required",
      });
      return;
    }

    if (!platform) {
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Platform is required", {
        error: "Platform is required",
      });
      return;
    }

    if (!currentStatus) {
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Current status is required", {
        error: "Current status is required",
      });
      return;
    }

    try {
      await this._adService.toggleCampaignStatus(
        req.details.orgId,
        role,
        userId,
        campaignId,
        platform,
        currentStatus
      );

      const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
      SendResponse(res, HTTPStatusCodes.OK, `Campaign ${newStatus.toLowerCase()} successfully`, {
        message: `Campaign ${newStatus.toLowerCase()} successfully`,
        newStatus,
      });
    } catch (error) {
      SendResponse(res, HTTPStatusCodes.INTERNAL_SERVER_ERROR, error.message, {
        error: error.message,
      });
    }
  };
}
