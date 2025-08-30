import { Ad, AdSet, Campaign } from "@/types"

 
export interface IAdService {
    getAllCampaigns(orgId: string, role: string, userId: string, selectedPlatforms: string[], selectedAdAccounts: string[]): Promise<Campaign[]>
    createCampaign(orgId: string, role: string, userId: string, adAccountId: string, platform: string, campaignData: any): Promise<Campaign>
    deleteCampaign(orgId: string, role: string, userId: string, campaignId: string, platform: string): Promise<void>
    toggleCampaignStatus(orgId: string, role: string, userId: string, campaignId: string, platform: string, currentStatus: string): Promise<void>
    getAllAdSets(orgId: string, role: string, userId: string, id:string,platform: string): Promise<AdSet[]>
    getAllAds(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<Ad[]>
    createAd(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<void>
}



