import { Request, Response } from "express";

export interface IInboxWebHookController {
      handleMetaWebHookVerification(req: Request, res: Response): Promise<void>;
      handleMetaWebHook(req: Request, res: Response): Promise<void>;
  
}