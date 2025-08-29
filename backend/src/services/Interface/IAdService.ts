 
export interface IAdService {
    getAllCampaigns(orgId: string, role: string, userId: string, selectedPlatforms: string[], selectedAdAccounts: string[]): Promise<any>
    getAllAdSets(orgId: string, role: string, userId: string, id:string,platform: string): Promise<any>
    getAllAds(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<any>
    createAd(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<any>
}



