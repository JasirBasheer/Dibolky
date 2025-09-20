import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, ResponseMessage, SendResponse } from "mern.common";
import { IStorageController } from "../Interface/IStorageController";
import { IStorageService } from "@/services";
import { fileKeySchema } from "@/validators";

@injectable()
export class StorageController implements IStorageController {
  constructor(
    @inject("StorageService") private readonly _storageService: IStorageService
  ) {}

  presign = async (req: Request, res: Response): Promise<void> => {
    const { fileName, fileType } = req.body;
    const file = await this._storageService.presign(fileName, fileType);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { file });
  };

  signedUrl = async (req: Request, res: Response): Promise<void> => {
    const { key } = fileKeySchema.parse({ key: req.query.key });
    const signedUrl = await this._storageService.signedUrl(key);
    res.json({ signedUrl });
  };

  initiateBatchUpload = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { files } = req.body;
    const filesInfo = await this._storageService.initiateBatchUpload(files);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { filesInfo });
  };
}
