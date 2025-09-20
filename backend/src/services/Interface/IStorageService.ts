import { BatchUploadFileInfo, BatchUploadFileInput } from "@/types";

 
export interface IStorageService {
  presign(fileName: string, fileType: string): Promise<Record<string, string>>;
  signedUrl(key: string): Promise<string>;
  initiateBatchUpload(files: BatchUploadFileInput[]): Promise<BatchUploadFileInfo[]
  >;
}



