import { Request, Response } from "express";

export interface IStorageController {
  presign(req: Request, res: Response): Promise<void>;
  signedUrl(req: Request, res: Response): Promise<void>;
  initiateBatchUpload(req: Request, res: Response): Promise<void>;
}
