import { inject, injectable } from "tsyringe";
import { IProviderService } from "../Interface/IProviderService";
import { FACEBOOK, INSTAGRAM } from "../../shared/utils/constants";
import { getMetaPagesDetails, handleFacebookUpload } from "../../provider.strategies/facebook.strategy";
import { handleInstagramUpload } from "../../provider.strategies/instagram.strategy";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IReviewBucket } from "../../shared/types/agency.types";
import { get } from "http";


@injectable()
export default class ProviderService implements IProviderService {
    private clientTenantRepository: IClientTenantRepository;
    private contentRepository : IContentRepository

    constructor(
        @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ContentRepository') contentRepository: IContentRepository,
    ) {
        this.clientTenantRepository = clientTenantRepository
        this.contentRepository = contentRepository
    }



    async handleSocialMediaUploads(
        orgId:string, 
        content: any, 
        clientId: string,
        isCron:boolean
    ): Promise<any> {

        const client = await this.clientTenantRepository.getClientById(orgId, clientId)
        if (!client) throw new Error('client does not exists')
       
        const uploadPromises = content.platforms.map(async (platform: any) => {
            console.log(platform.scheduledDate)
            if(platform.scheduledDate != "" && !isCron)    return null;

                let access_token;
                let response;

                
                try {
                    switch (platform.platform) {
                        case INSTAGRAM:
                            access_token = client?.socialMedia_credentials?.instagram.accessToken;
                            if(!access_token) throw new Error('Instagram access token not found');
                            return response = await handleInstagramUpload(content, access_token, client);
                                                        
                        case FACEBOOK:
                            access_token = client?.socialMedia_credentials?.facebook.accessToken;
                            if(!access_token) throw new Error('FaceBook access token not found');
                            return response = await handleFacebookUpload(content, access_token, client);
                             
                        default:
                            throw new Error(`Unsupported platform: ${platform}`);
                    }
                } catch (error:any) {
                    return {
                        platform,
                        status: 'error',
                        error: error.message || 'Unknown error occurred'
                    };
                }
            
          
        });
       

        const results = await Promise.all(uploadPromises);
        const validResults : any = results.filter(result => result !== null);

        if(validResults.length==0)return results        
        console.log('Upload Results:', results);
        
        const successfulUploads = results.filter(result => result.status === 'success');
        if (successfulUploads.length === 0) {
            throw new Error('All uploads failed: ' + 
                results.map(r => `${r.platform}: ${r.error}`).join(', '));
        }

        return results
        
    }

    async getMetaPagesDetails(access_token:string):Promise<any>{
        return await getMetaPagesDetails(access_token)
    }


    async updateContentStatus(
        orgId: string, 
        contentId: string, 
        status: string
    ): Promise<IReviewBucket | null> {
       return await this.contentRepository.changeContentStatus(orgId, contentId, status)
    }


    async getContentById(
        orgId:string,
        contentId:string
    ):Promise<IReviewBucket | null>{
        return await this.contentRepository.getContentById(orgId,contentId)
    }

}
