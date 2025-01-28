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



    async handleSocialMediaUploads(tenantDb: any, contentId: string, clientId: string): Promise<any> {

        const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
        const content = await this.clientRepository.getContentById(contentId, db)

        if (!content) throw new Error('content does not exists')

        const client = await this.agencyRepository.getClientById(tenantDb, clientId)
        if (!client) throw new Error('client does not exists')

        if (content.isScheduled) return "Approve content"


        const uploadPromises = content.platform.map(async (platform: string) => {
            let access_token;
            let response;
            
            try {
                switch (platform) {
                    case INSTAGRAM:
                        access_token = client.socialMedia_credentials.instagram.accessToken;
                        response = await handleInstagramUpload(content, access_token);
                        return {
                            platform: INSTAGRAM,
                            status: 'success',
                            response
                        };
                        
                    case FACEBOOK:
                        access_token = client.socialMedia_credentials.facebook.accessToken;
                        response = await handleFacebookUpload(content, access_token);
                        return {
                            platform: FACEBOOK,
                            status: 'success',
                            response
                        };
                        
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
        
        console.log('Upload Results:', results);
        
        const successfulUploads = results.filter(result => result.status === 'success');
        if (successfulUploads.length === 0) {
            throw new Error('All uploads failed: ' + 
                results.map(r => `${r.platform}: ${r.error}`).join(', '));
        }

        return {
            successful: successfulUploads,
            failed: results.filter(result => result.status == 'error'),
            totalAttempted: results.length,
            totalSuccessful: successfulUploads.length
        };
        
    }






    async updateContentStatus(tenantDb: any, contentId: string, status: string): Promise<any> {
        const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
       return await this.clientRepository.changeContentStatusById(contentId, db, status)
    }

}
