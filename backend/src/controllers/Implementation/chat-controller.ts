import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { IChatController } from "../Interface";
import { IChatService } from "@/services";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("ChatService") private readonly _chatService: IChatService
  ) {}

    getChats = async (req: Request, res: Response): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { userId } = req.params;
    const chats = await this._chatService.getChats(
      req.details.orgId as string,
      userId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats });
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

    getAgoraTokens = async (req: Request, res: Response): Promise<void> => {
    const { userId, channelName } = req.query as {
      userId: string;
      channelName?: string;
    };
    const { rtmToken, rtcToken } = await this._chatService.getAgoraTokens(
      userId,
      channelName
    );
    res.json({ rtmToken, rtcToken });
  };

}
