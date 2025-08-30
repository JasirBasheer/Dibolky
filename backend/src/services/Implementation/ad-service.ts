import { inject, injectable } from "tsyringe";
import { NotFoundError } from "mern.common";
import { IAdService } from "../Interface/IAdService";
import {
  IAgencyTenantRepository,
  IClientTenantRepository,
} from "@/repositories";
import { decryptToken, PLATFORMS, ROLES } from "@/utils";
import { getAllAds, getMetaCampaigns } from "@/providers/meta";
import { getAllAdSetsByCampaignId } from "@/providers/meta/ads/adset";
import { createMetaCampaign } from "@/providers/meta/ads/campaign";
import { Ad, AdSet, Campaign } from "@/types";
import { CreateCampaignDto } from "@/dtos/campaign";
import { deleteMetaCampaign, toggleMetaCampaignStatus } from "@/providers/meta/ads/campaign";

@injectable()
export class AdService implements IAdService {
  constructor(
    @inject("AgencyTenantRepository")
    private readonly _agencyTenantRepository: IAgencyTenantRepository,
    @inject("ClientTenantRepository")
    private readonly _clientTenantRepository: IClientTenantRepository
  ) {}

  async getAllCampaigns(
    orgId: string,
    role: string,
    userId: string,
    selectedPlatforms: string[],
    selectedAdAccounts: string[]
  ): Promise<Campaign[]> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    let campaigns = [];
    if (selectedPlatforms.includes("meta_ads")) {
      const token = decryptToken(user.social_credentials.meta_ads.accessToken);
      if (!token) return;
      const validCampaigns = [];
      for (const AdAccId of selectedAdAccounts) {
        const campaign = await getMetaCampaigns(token, AdAccId);
        const taggedCampaigns = campaign.map((c) => ({
          ...c,
          platform: PLATFORMS.META_ADS,
        }));
        validCampaigns.push(...taggedCampaigns);
      }
      campaigns.push(...validCampaigns);
    }

    return campaigns;
  }

  async createCampaign(
    orgId: string,
    role: string,
    userId: string,
    adAccountId: string,
    platform: string,
    campaignData: CreateCampaignDto
  ): Promise<Campaign> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    
    if (!user)
      throw new NotFoundError("user details not found please try again later");

    if (platform === PLATFORMS.META_ADS) {
      const token = decryptToken(user.social_credentials?.meta_ads?.accessToken);
      if (!token)
        throw new NotFoundError("token not found please reconnect meta ad account");

      try {
        const createdCampaign = await createMetaCampaign(
          token,
          adAccountId,
          campaignData.name,
          campaignData.objective,
          {
            status: campaignData.status,
            special_ad_categories: campaignData.special_ad_categories,
            daily_budget: campaignData.daily_budget,
            lifetime_budget: campaignData.lifetime_budget,
            start_time: campaignData.start_time,
            stop_time: campaignData.stop_time,
          }
        );

        // Return the created campaign with platform tag
        return {
          ...createdCampaign,
          platform: PLATFORMS.META_ADS,
        };
      } catch (error) {
        throw new Error(`Failed to create Meta campaign: ${error.message}`);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async deleteCampaign(
    orgId: string,
    role: string,
    userId: string,
    campaignId: string,
    platform: string
  ): Promise<void> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    
    if (!user)
      throw new NotFoundError("user details not found please try again later");

    if (platform === PLATFORMS.META_ADS) {
      const token = decryptToken(user.social_credentials?.meta_ads?.accessToken);
      if (!token)
        throw new NotFoundError("token not found please reconnect meta ad account");

      try {
        await deleteMetaCampaign(token, campaignId);
      } catch (error) {
        throw new Error(`Failed to delete Meta campaign: ${error.message}`);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async toggleCampaignStatus(
    orgId: string,
    role: string,
    userId: string,
    campaignId: string,
    platform: string,
    currentStatus: string
  ): Promise<void> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    
    if (!user)
      throw new NotFoundError("user details not found please try again later");

    if (platform === PLATFORMS.META_ADS) {
      const token = decryptToken(user.social_credentials?.meta_ads?.accessToken);
      if (!token)
        throw new NotFoundError("token not found please reconnect meta ad account");

      try {
        await toggleMetaCampaignStatus(token, campaignId, currentStatus);
      } catch (error) {
        throw new Error(`Failed to toggle Meta campaign status: ${error.message}`);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async getAllAdSets(
    orgId: string,
    role: string,
    userId: string,
    id: string,
    platform: string
  ): Promise<AdSet[]> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    if (!user)
      throw new NotFoundError("user details not found please try again later");
    let adsets = [];
    if (platform == PLATFORMS.META_ADS) {
      const token = decryptToken(
        user.social_credentials?.meta_ads?.accessToken
      );
      if (!token)
        throw new NotFoundError(
          "token not found please reconnect meta ad account"
        );
      const ads = await getAllAdSetsByCampaignId(id, token);
      adsets = ads.map((adset) => ({
        ...adset,
        platform: PLATFORMS.META_ADS,
      }));
    }

    return adsets;
  }

  async getAllAds(
    orgId: string,
    role: string,
    userId: string,
    adsetId: string,
    platform: string
  ): Promise<Ad[]> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    if (!user)
      throw new NotFoundError("user details not found please try again later");
    let ads = [];
    if (platform == PLATFORMS.META_ADS) {
      const token = decryptToken(
        user.social_credentials?.meta_ads?.accessToken
      );
      if (!token)
        throw new NotFoundError(
          "token not found please reconnect meta ad account"
        );
      ads = await getAllAds(adsetId, token, platform);
    }
    return ads;
  }

  async createAd(
    orgId: string,
    role: string,
    userId: string,
    adsetId: string,
    platform: string
  ): Promise<void> {
    const user =
      role === ROLES.AGENCY
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    if (!user)
      throw new NotFoundError("user details not found please try again later");
    let createdAd;
    // if(platform == PLATFORMS.META_ADS){
    //   const token = user.social_credentials?.meta_ads?.accessToken
    //   if(!token)throw new NotFoundError("token not found please reconnect meta ad account")
    //     createdAd = await createMetaAd(adsetId,{ name, adset_id, creative, status },platform)
    // }
  }
}
