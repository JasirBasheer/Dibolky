import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { IProviderController } from "../Interface/IProviderController";
import { IProviderService } from "../../services/Interface/IProviderService";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { IBucket } from "../../types/common";
import { gmailAuthCallback } from "@/providers/google";
import { xAuthCallback } from "@/providers/x";
import { linkedInAuthCallback } from "@/providers/linkedin";
import { QueryParser } from "@/utils";

@injectable()
export class ProviderController implements IProviderController {
  private _providerService: IProviderService;
  private _agencyService: IAgencyService;

  constructor(
    @inject("ProviderService") providerService: IProviderService,
    @inject("AgencyService") agencyService: IAgencyService
  ) {
    this._providerService = providerService;
    this._agencyService = agencyService;
  }

  processContentApproval = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("Details Not Fount");
    const { content_id, platform } = req.body;
    const content: IBucket | null = await this._providerService.getContentById(
      req.details.orgId as string,
      content_id
    );
    let user;
    if (platform == "agency") {
      user = await this._agencyService.getAgencyOwnerDetails(
        req.details.orgId as string
      );
    } else {
      user = await this._agencyService.getAgencyOwnerDetails(
        req.details.orgId as string
      );
    }
    if (!content) throw new Error("content does not exists");

    const response = await this._providerService.handleSocialMediaUploads(
      content,
      user,
      false
    );

    if (response) {
      await this._providerService.updateContentStatus(
        req.details.orgId as string,
        content_id,
        "Approved"
      );
    }
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  getMetaPagesDetails = async (req: Request, res: Response): Promise<void> => {
    const { role, userId } = req.params;
    const pages = await this._providerService.getMetaPagesDetails(
      req.details.orgId,
      role,
      userId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { pages });
  };

  connectSocialPlatforms = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { provider } = req.params;
    const redirectUri: string = req.query.redirectUri as string;
    const state: string = req.query.state as string;
    const url = await this._providerService.getOAuthUrl(
      provider,
      redirectUri,
      state
    );
    res.send({ url: url });
  };

  saveSocialPlatformToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("Details Not Fount");
    const { platform, provider, user_id } = req.params;
    const { accessToken, refreshToken } = req.body;
    await this._providerService.saveSocialMediaToken(
      req.details.orgId as string,
      platform,
      user_id,
      provider,
      accessToken,
      refreshToken
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  rescheduleContent = async (req: Request, res: Response): Promise<void> => {
    const { contentId, platformId, date } = req.body;
    await this._providerService.rescheduleContent(
      req.details.orgId,
      contentId,
      platformId,
      date
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  processContentReject = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("Details Not Fount");
    const { content_id, reason } = req.body;
    await this._providerService.rejectContent(
      req.details.orgId as string,
      content_id,
      reason
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  getContentDetails = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id, platform, mediaId, pageId, mediaType } =
      req.params;
    const content = await this._providerService.getContentDetails(
      req.details.orgId as string,
      entity,
      user_id,
      platform,
      mediaId,
      mediaType,
      pageId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { content });
  };

  replayToComments = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id, platform, commentId, replyMessage, pageId } =
      req.body;
    const comment = await this._providerService.replayToComments(
      req.details.orgId as string,
      entity,
      user_id,
      platform,
      commentId,
      pageId,
      replyMessage
    );
    console.log(comment, "new comment");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { comment });
  };

  deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { platform, commentId, userId, entity, pageId } = req.body;
    const deletedComment = await this._providerService.deleteComment(
      req.details.orgId,
      userId,
      entity,
      pageId,
      platform,
      commentId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      deletedComment,
    });
  };

  hideComment = async (req: Request, res: Response): Promise<void> => {
    const { platform, commentId, userId, entity, pageId } = req.body;
    const hidenComment = await this._providerService.hideComment(
      req.details.orgId,
      userId,
      entity,
      pageId,
      platform,
      commentId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      hidenComment,
    });
  };

  saveContent = async (req: Request, res: Response): Promise<void> => {
    const { platform, user_id } = req.params;
    const { files, platforms, metadata, contentType } = req.body;
    await this._providerService.saveContent({
      orgId: req.details.orgId as string,
      platform,
      platforms,
      user_id,
      files,
      metadata,
      contentType,
    });

    SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED);
  };

  fetchContents = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._providerService.fetchContents(
      req.details.orgId as string,
      role,
      userId,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  handleLinkedinCallback = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { code, state } = req.body;
    console.log(code, state, "test form linkledin");
    const tokens = await linkedInAuthCallback(code as string, state as string);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { tokens });
  };

  handleXCallback = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { code, state } = req.body;
    const tokens = await xAuthCallback(code as string, state as string);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { tokens });
  };

  handleGmailCallback = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { code } = req.body;
    const tokens = await gmailAuthCallback(code as string);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { tokens });
  };

  fetchAllScheduledContents = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { user_id } = req.params;
    const scheduledContents = await this._providerService.getScheduledContent(
      req.details.orgId as string,
      user_id
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      scheduledContents,
    });
  };

  getConnections = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id } = req.params;
    const { includes } = req.query as { includes: string };
    const connections = await this._providerService.getConnections(
      req.details.orgId as string,
      entity,
      user_id,
      includes
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      connections: connections.validConnections,
      connectedPages: connections.connectedPages,
      adAccounts: connections.adAccounts,
    });
  };
}
