import { IContentData, IFilesMetaData } from "@/types/common.types";
import api from "@/utils/axios";

export const savePlatformTokenApi = async( 
    platform:string,
    provider:string,
    user_id:string,
    token:string
) => {
    return await api.post(
        `/api/entities/save-platform-token/${platform}/${provider}/${user_id}`,
        { token }
      );
}

export const InitiateS3BatchUpload = async(
    filesMetadata:IFilesMetaData[]
) =>{ 
    return await api.post('/api/entities/initiate-s3-batch-upload', {
        files: filesMetadata
      });
}



export const saveContentApi = async(
    platform:string,
    user_id:string,
    contentData:IContentData
) =>{ 
    return await api.post(`/api/entities/content/save/${platform}/${user_id}`, 
        contentData
    );
}