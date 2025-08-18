import { Request, Response } from "express";
import { IEntityController } from "../Interface/IEntityController";
import { IEntityService } from "../../services/Interface/IEntityService";
import { inject, injectable } from "tsyringe";
import { IChatService } from "../../services/Interface/IChatService";
import s3Client from "../../config/aws.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { CountryToCurrency } from "../../utils/currency-conversion.utils";
import {
  findCountryByIp,
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { linkedInAuthCallback } from "@/providers/linkedin";
import { xAuthCallback } from "@/providers/x";
import { QueryParser } from "@/utils/query-parser";
import { gmailAuthCallback } from "@/providers/google";
import { env } from "@/config";

@injectable()
export class EntityController implements IEntityController {
  private _entityService: IEntityService;
  private _chatService: IChatService;

  constructor(
    @inject("EntityService") entityService: IEntityService,
    @inject("ChatService") chatService: IChatService
  ) {
    this._entityService = entityService;
    this._chatService = chatService;
  }




  getMenu = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { role, planId } = req.params;
    let menu;
    if (role === "agency") {
      menu = await this._entityService.getMenu(planId);
    } else {
      menu = await this._entityService.getClientMenu(
        req.details.orgId as string,
        planId
      );
    }
    if (!menu)
      SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Invalid role provided");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { menu });
  };

  getOwner = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const ownerDetails = await this._entityService.getOwner(
      req.details.orgId as string
    );

    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      ownerDetails: ownerDetails[0],
    });
  };

  getChats = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { userId } = req.params;
    const chats = await this._chatService.getChats(
      req.details.orgId as string,
      userId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats });
  };

  getInbox = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { entity, user_id } = req.params;
    const { selectedPlatforms, selectedPages } = req.body;
    const users = await this._entityService.getInbox(
      req.details.orgId as string,
      entity,
      user_id,
      selectedPlatforms,
      selectedPages
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users });
  };

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

  getContentDetails = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id, platform, mediaId, pageId, mediaType } =
      req.params;
    const content = await this._entityService.getContentDetails(
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
    const comment = await this._entityService.replayToComments(
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
    const deletedComment = await this._entityService.deleteComment(
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
    const hidenComment = await this._entityService.hideComment(
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

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { conversation_id, access_token, message, type, media_url } =
      req.body;
    // const users = await this._entityService.getInbox(req.details.orgId as string,conversation_id, access_token, message, type, media_url)
    // SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users })
  };

  getInboxMessages = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { user_id, platform, conversationId } = req.params;
    const messages = await this._entityService.getInboxMessages(
      req.details.orgId as string,
      user_id,
      platform,
      conversationId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      messages,
    });
  };

  getChat = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { chatId } = req.body;
    const chats = await this._chatService.getChat(
      req.details.orgId as string,
      chatId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats });
  };

  getMessages = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    // const messages = await this._chatService.getMessages(req.details.orgId,userId)
  };

  createGroup = async (req: Request, res: Response): Promise<void> => {
    const { details, userId } = req.body;
    const createdGroup = await this._chatService.createGroup(
      req.details?.orgId as string,
      userId,
      details
    );
    console.log(createdGroup);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      group: createdGroup,
    });
  };

  getAllProjects = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.query as {userId: string, role: string};
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._entityService.fetchAllProjects(
      req.details.orgId as string,
      userId,
      role,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  markProjectAsCompleted = async (req: Request, res: Response): Promise<void> => {
    const { projectId } =req.query as {projectId: string};
    await this._entityService.markProjectAsCompleted(req.details.orgId,projectId)
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  }

  initiateS3BatchUpload = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { files } = req.body;

    const filesInfo = await Promise.all(
      files.map(
        async (file: { fileName: string; fileType: string; id: string }) => {
          const key = `test/${uuidv4()}-${file.fileName}`;

          const command = new PutObjectCommand({
            Bucket: "dibolky-test-app",
            Key: key,
            ContentType: file.fileType,
            ContentDisposition: "inline",
          });

          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });

          return {
            fileId: file.id,
            key,
            url,
            contentType: file.fileType,
          };
        }
      )
    );

    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      filesInfo,
    });
  };

  getUploadS3Url = async (req: Request, res: Response): Promise<void> => {
    const { file } = req.body;
    console.log(file);

    const key = `test/${uuidv4()}-${file.fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS.S3.BUCKET_NAME,
      Key: key,
      ContentType: file.fileType,
      ContentDisposition: "inline",
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    const s3file = {
      key,
      url,
      contentType: file.fileType,
    };

    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { s3file });
  };

  saveContent = async (req: Request, res: Response): Promise<void> => {
    const { platform, user_id } = req.params;
    const { files, platforms, metadata, contentType } = req.body;
    await this._entityService.saveContent({
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

  getS3ViewUrl = async (req: Request, res: Response): Promise<void> => {
    const { key } = req.body;
    const signedUrl = await this._entityService.getS3ViewUrl(key);

    res.json({ signedUrl });
  };

  fetchContents = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._entityService.fetchContents(
      req.details.orgId as string,
      role,
      userId,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
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
    if (!req.details) throw new NotFoundError("request details not found");
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
    if (!req.details) throw new NotFoundError("request details not found");
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

  fetchAllScheduledContents = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { user_id } = req.params;
    const scheduledContents = await this._entityService.getScheduledContent(
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
    const connections = await this._entityService.getConnections(
      req.details.orgId as string, entity, user_id, includes
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      connections: connections.validConnections,
      connectedPages: connections.connectedPages,
      adAccounts: connections.adAccounts,
    });
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

  getAgoraTokens = async (req: Request, res: Response): Promise<void> => {
    const { userId, channelName } = req.query as {
      userId: string;
      channelName?: string;
    };
    const { rtmToken, rtcToken } = await this._entityService.getAgoraTokens(
      userId,
      channelName
    );
    res.json({ rtmToken, rtcToken });
  };

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

    const campaigns = await this._entityService.getAllCampaigns(
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
    const adsets = await this._entityService.getAllAdSets(
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
    const adsets = await this._entityService.getAllAdSets(
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

    const ads = await this._entityService.getAllAds(
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

    const ads = await this._entityService.createAd(
      req.details.orgId,
      role,
      userId,
      adsetId,
      platform
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ads });
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
