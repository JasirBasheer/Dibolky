import { Request, Response } from "express";

export interface IChatController {
  getChats(req: Request, res: Response): Promise<void>;
  getChat(req: Request, res: Response): Promise<void>;
  getAgoraTokens(req: Request, res: Response): Promise<void>
}
