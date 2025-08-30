import { Request, Response } from "express";

export interface IStorageController {
  presign(req: Request, res: Response): Promise<void>;
  signedS3Url(req: Request, res: Response): Promise<void>;
}
