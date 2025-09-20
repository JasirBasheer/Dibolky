import { inject, injectable } from "tsyringe";
import { IStorageService } from "../Interface/IStorageService";
import { IStorageProvider } from "@/providers/storage/IStorageProvider";
import { BatchUploadFileInfo, BatchUploadFileInput } from "@/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/config/aws.config";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class StorageService implements IStorageService {
  constructor(
    @inject("StorageProvider")
    private readonly _storageProvider: IStorageProvider
  ) {}

  async presign(
    fileName: string,
    fileType: string
  ): Promise<Record<string, string>> {
    return await this._storageProvider.presign(fileName, fileType);
  }

  async signedUrl(key: string): Promise<string> {
    return await this._storageProvider.signedS3Url(key);
  }

  async initiateBatchUpload(
    files: BatchUploadFileInput[]
  ): Promise<BatchUploadFileInfo[]> {
    return await Promise.all(
      files.map(
        async (file: { fileName: string; fileType: string; id: string }) => {
          const key = `test/${uuidv4()}-${file.fileName}`;

          const command = new PutObjectCommand({
            Bucket: "dibolky-test-app",
            Key: key,
            ContentType: file.fileType,
            ContentDisposition: "inline",
          });

          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });

          return {
            fileId: file.id,
            key,
            url,
            contentType: file.fileType,
          };
        }
      )
    );
  }
}
