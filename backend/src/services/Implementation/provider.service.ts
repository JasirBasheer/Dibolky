import { inject, injectable } from "tsyringe";
import { ReviewBucketSchema } from "../../models/agency/reviewBucketModel";
import { IProviderService } from "../Interface/IProviderService";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { FACEBOOK, INSTAGRAM } from "../../shared/utils/constants";
import { handleFacebookUpload } from "../../provider.strategies/facebook.strategy";
import { handleInstagramUpload } from "../../provider.strategies/instagram.strategy";


@injectable()
export default class ProviderService implements IProviderService {
    private agencyRepository: IAgencyRepository;
    private clientRepository: IClientRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository: IAgencyRepository,
        @inject('ClientRepository') clientRepository: IClientRepository
    ) {
        this.agencyRepository = agencyRepository
        this.clientRepository = clientRepository
    }



    async handleSocialMediaUploads(tenantDb: any, content: any, clientId: string,isCron:boolean): Promise<any> {

        const client = await this.agencyRepository.getClientById(tenantDb, clientId)
        if (!client) throw new Error('client does not exists')
       
        const uploadPromises = content.platforms.map(async (platform: any) => {
            console.log(platform.scheduledDate)
            if(platform.scheduledDate != "" && !isCron)    return null;

                let access_token;
                let response;

                
                try {
                    switch (platform.platform) {
                        case INSTAGRAM:
                            access_token = client.socialMedia_credentials.instagram.accessToken;
                            return response = await handleInstagramUpload(content, access_token, client);
                                                        
                        case FACEBOOK:
                            access_token = client.socialMedia_credentials.facebook.accessToken;
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

        if(validResults.length==0){
            return results

        }

        
        console.log('Upload Results:', results);
        
        const successfulUploads = results.filter(result => result.status === 'success');
        if (successfulUploads.length === 0) {
            throw new Error('All uploads failed: ' + 
                results.map(r => `${r.platform}: ${r.error}`).join(', '));
        }

        return results
        
    }



    async updateContentStatus(tenantDb: any, contentId: string, status: string): Promise<any> {
        const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
       return await this.clientRepository.changeContentStatusById(contentId, db, status)
    }


    async getContentById(contentId:any, db:any):Promise<any>{
        return await this.clientRepository.getContentById(contentId,db)
    }

}
