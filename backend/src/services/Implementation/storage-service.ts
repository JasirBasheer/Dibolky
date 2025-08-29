import { inject, injectable } from "tsyringe";
import { IStorageService } from "../Interface/IStorageService";
import { IStorageProvider } from "@/providers/storage/IStorageProvider";

@injectable()
export class StorageService implements IStorageService {

  constructor(
    @inject("StorageProvider") private readonly _storageProvider: IStorageProvider,
  ) {}

  async presign(fileName: string, fileType: string): Promise<Record<string, string>> {
    return await this._storageProvider.presign(fileName, fileType);
  }

  async signedS3Url(key: string): Promise<string> {
    return await this._storageProvider.signedS3Url(key);
  }


}
