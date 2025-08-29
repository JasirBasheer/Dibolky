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
import { Ad, AdSet, Campaign } from "@/types";

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
