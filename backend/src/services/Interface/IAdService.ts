import { Ad, AdSet, Campaign } from "@/types"

 
export interface IAdService {
    getAllCampaigns(orgId: string, role: string, userId: string, selectedPlatforms: string[], selectedAdAccounts: string[]): Promise<Campaign[]>
    getAllAdSets(orgId: string, role: string, userId: string, id:string,platform: string): Promise<AdSet[]>
    getAllAds(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<Ad[]>
    createAd(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<void>
}



