import { inject, injectable } from "tsyringe";
import { IProviderService } from "../Interface/IProviderService";
import { getMetaPagesDetails, handleFacebookUpload } from "../../provider.strategies/facebook.strategy";
import { exchangeForLongLivedToken, handleInstagramUpload } from "../../provider.strategies/instagram.strategy";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenant } from "../../types/agency.types";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IMetaAccount, IPlatforms, IBucket, ISocialMediaUploadResponse } from "../../types/common.types";
import { IClientTenant } from "../../types/client.types";
import { IInfluncerTenant } from "../../types/influencer.types";
import { FACEBOOK, INSTAGRAM } from "../../utils/constants.utils";


@injectable()
export default class ProviderService implements IProviderService {
    private clientTenantRepository: IClientTenantRepository;
    private contentRepository: IContentRepository;
    private agencyTenantRepository: IAgencyTenantRepository;

    constructor(
        @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ContentRepository') contentRepository: IContentRepository,
        @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
    ) {
        this.clientTenantRepository = clientTenantRepository
        this.contentRepository = contentRepository
        this.agencyTenantRepository = agencyTenantRepository
    }

    


    async handleSocialMediaUploads(
        content: IBucket,
        user: IClientTenant | IAgencyTenant | IInfluncerTenant | null,
        isCron: boolean
    ): Promise<ISocialMediaUploadResponse[]> {

        if (!user) throw new Error('user does not exists')

        const uploadPromises = content.platforms.map(async (platform: IPlatforms) => {
            if (platform.scheduledDate != "" && !isCron) return null;

            let access_token;
            let response;


            try {
                switch (platform.platform) {
                    case INSTAGRAM:
                        access_token = user?.socialMedia_credentials?.instagram?.accessToken;
                        if (!access_token) throw new Error('Instagram access token not found');
                        return response = await handleInstagramUpload(content, access_token);

                    case FACEBOOK:
                        access_token = user?.socialMedia_credentials?.facebook?.accessToken;
                        if (!access_token) throw new Error('FaceBook access token not found');
                        return response = await handleFacebookUpload(content, access_token);

                    default:
                        throw new Error(`Unsupported platform: ${platform}`);
                }
            } catch (error: unknown) {
                 throw error  
            };
        });


        const results = await Promise.all(uploadPromises);
        const validResults: ISocialMediaUploadResponse[] = results.filter(
            (result): result is ISocialMediaUploadResponse => result !== null
        );

        if (validResults.length == 0) return validResults
        console.log('Upload Results:', results);

        const successfulUploads = results.filter(result => result!.status === 'success');
        if (successfulUploads.length === 0) {
            throw new Error('All uploads failed');
        }

        return validResults

    }

    async getMetaPagesDetails(
        access_token: string
    ): Promise<IMetaAccount[]> {
        return await getMetaPagesDetails(access_token)
    }


    async updateContentStatus(
        orgId: string,
        contentId: string,
        status: string
    ): Promise<IBucket | null> {
        return await this.contentRepository.changeContentStatus(orgId, contentId, status)
    }


    async getContentById(
        orgId: string,
        contentId: string
    ): Promise<IBucket | null> {
        return await this.contentRepository.getContentById(orgId, contentId)
    }


    async saveSocialMediaToken(
        orgId: string,
        platform: string,
        user_id: string,
        provider: string,
        token: string
    ): Promise<void> {

        if (user_id) {
            let longLivingAccessToken:string = token
            switch (platform) {
                case 'agency':
                    if(provider == INSTAGRAM || provider == FACEBOOK ){
                        longLivingAccessToken = await exchangeForLongLivedToken(token)
                    }
                    await this.agencyTenantRepository.setSocialMediaTokens(orgId, provider, longLivingAccessToken)
                    break;
                case 'client':
                    if(provider == INSTAGRAM || provider == FACEBOOK){
                        longLivingAccessToken = await exchangeForLongLivedToken(token)
                    }
                    await this.clientTenantRepository.setSocialMediaTokens(orgId, user_id, provider, longLivingAccessToken)
                    break;
                case 'influencer':
                    // await this.clientService.saveClientSocialMediaTokens(req.details.orgId, user_id, provider, token)
                    break;
                default:
                    break;
            }
        }

    }

    
    async reScheduleContent(
        orgId:string,
        content_id:string,
        date:string
    ):Promise<void>{
        await this.contentRepository.reScheduleContent(orgId,content_id,date)
    }

}
