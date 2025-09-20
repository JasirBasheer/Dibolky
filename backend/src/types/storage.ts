export interface BatchUploadFileInput {
  fileName: string;
  fileType: string;
  id: string;
};

export interface BatchUploadFileInfo {
  fileId: string;
  key: string;
  url: string;
  contentType: string;
};
