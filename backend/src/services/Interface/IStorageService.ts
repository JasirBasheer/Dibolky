 
export interface IStorageService {
  presign(fileName: string, fileType: string): Promise<Record<string, string>>;
  signedS3Url(key: string): Promise<string>;
}



