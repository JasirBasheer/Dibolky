import { Request, Response } from "express";

export interface IInboxController {
    getInbox(req: Request, res: Response): Promise<void>
    getInboxMessages(req: Request, res: Response): Promise<void>
}