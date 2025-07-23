import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, ResponseMessage, SendResponse } from "mern.common";
import { IInboxWebHookController } from "@/controllers/Interface/IInboxWebHookController";
import logger from "@/logger";
import { getRedisClient, META_WEBHOOK_VERIFY_TOKEN } from "@/config";

@injectable()
export class InboxWebhookController implements IInboxWebHookController {
    
  handleMetaWebHookVerification = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {
      "hub.mode": mode,
      "hub.verify_token": token,
      "hub.challenge": challenge,
    } = req.query;
    if (mode === "subscribe" && token === META_WEBHOOK_VERIFY_TOKEN) {
      logger.info("Webhook verification successful", { challenge });
      res.status(200).send(challenge);
    } else {
      logger.warn("Webhook verification failed", { token });
      res.sendStatus(403);
    }
  };

  handleMetaWebHook = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    // const redisClient = getRedisClient()
    // await redisClient.lPush("webhook_queue", JSON.stringify(req.body));
    console.log('post func called')
    console.log('Webhook payload:', JSON.stringify(req.body, null, 2));
    logger.info("Webhook payload queued", { payload: req.body });
    res.sendStatus(200);
  }

  
}
