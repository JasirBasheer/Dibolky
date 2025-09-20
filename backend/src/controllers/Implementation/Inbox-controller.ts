import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, ResponseMessage, SendResponse } from "mern.common";
import { IInboxController } from "../Interface";
import { IInboxService } from "@/services";

@injectable()
export class InboxController implements IInboxController {
  constructor(
    @inject("InboxService") private readonly _inboxService: IInboxService
  ) {}

  getInbox = async (req: Request, res: Response): Promise<void> => {
    const { entity, user_id } = req.params;
    const { selectedPlatforms, selectedPages } = req.body;
    const users = await this._inboxService.getInbox(
      req.details.orgId as string,
      entity,
      user_id,
      selectedPlatforms,
      selectedPages
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users });
  };

  getInboxMessages = async (req: Request, res: Response): Promise<void> => {
    const { user_id, platform, conversationId } = req.params;
    const messages = await this._inboxService.getInboxMessages(
      req.details.orgId as string,
      user_id,
      platform,
      conversationId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      messages,
    });
  };
}
