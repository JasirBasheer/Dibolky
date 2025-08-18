import { inject, injectable } from "tsyringe";
import { IProviderService } from "../Interface/IProviderService";
import {
  createFacebookOAuthURL,
  createMetaAdsOAuthURL,
  handleFacebookUpload,
} from "@/providers/meta";
import {
  createInstagramOAuthURL,
  exchangeForLongLivedToken,
  handleInstagramUpload,
} from "@/providers/meta/instagram";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenant } from "../../types/agency";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import {
  IMetaAccount,
  IPlatforms,
  IBucket,
  ISocialMediaUploadResponse,
} from "../../types/common";
import { IInfluncerTenant } from "../../types/influencer";
import {
  FACEBOOK,
  INSTAGRAM,
  LINKEDIN,
  PLATFORMS,
  X,
} from "../../utils/constants";
import { INote } from "../../types/note";
import { INoteRepository } from "../../repositories/Interface/INoteRepository";
import { CustomError, sendMail } from "mern.common";
import { handleLinkedinUpload } from "@/providers/linkedin/handler";
import { createXAuthURL, handleXUpload } from "@/providers/x";
import { getMetaPagesDetails } from "@/providers/meta/facebook";
import { IClientTenant } from "@/models";
import { createLinkedInOAuthURL } from "@/providers/linkedin";
import { createGoogleOAuthURL } from "@/providers/google";
import { decryptToken, encryptToken } from "@/utils";

@injectable()
export class ProviderService implements IProviderService {
  private _clientTenantRepository: IClientTenantRepository;
  private _contentRepository: IContentRepository;
  private _agencyTenantRepository: IAgencyTenantRepository;
  private _noteRepository: INoteRepository;

  constructor(
    @inject("ClientTenantRepository")
    clientTenantRepository: IClientTenantRepository,
    @inject("ContentRepository") contentRepository: IContentRepository,
    @inject("AgencyTenantRepository")
    agencyTenantRepository: IAgencyTenantRepository,
    @inject("NoteRepository") noteRepository: INoteRepository
  ) {
    this._clientTenantRepository = clientTenantRepository;
    this._contentRepository = contentRepository;
    this._agencyTenantRepository = agencyTenantRepository;
    this._noteRepository = noteRepository;
  }

  async handleSocialMediaUploads(
    content: IBucket,
    user: IClientTenant | IAgencyTenant | IInfluncerTenant | null,
    isCron: boolean
  ): Promise<ISocialMediaUploadResponse[]> {
    if (!user) throw new Error("user does not exists");

    const uploadPromises = content.platforms.map(
      async (platform: IPlatforms) => {
        if (platform.scheduledDate != "" && !isCron) return null;

        let access_token;
        let response;

        try {
          switch (platform.platform) {
            case INSTAGRAM:
              access_token = user?.social_credentials?.instagram?.accessToken;
              if (!access_token)throw new Error("Instagram access token not found");
              return (response = await handleInstagramUpload(
                content,
                decryptToken(access_token)
              ));

            case FACEBOOK:
              access_token = user?.social_credentials?.facebook?.accessToken;
              if (!access_token)
                throw new Error("FaceBook access token not found");
              return (response = await handleFacebookUpload(
                content,
                decryptToken(access_token)
              ));

            case LINKEDIN:
              access_token = user?.social_credentials?.linkedin?.accessToken;
              if (!access_token)
                throw new Error("Linkedin access token not found");
              return (response = await handleLinkedinUpload(
                content,
                decryptToken(access_token)
              ));

            case X:
              access_token = user?.social_credentials?.x?.accessToken;
              if (!access_token)
                throw new Error("Linkedin access token not found");
              return (response = await handleXUpload(content, decryptToken(access_token)));

            default:
              throw new Error(`Unsupported platform: ${platform}`);
          }
        } catch (error: unknown) {
          throw error;
        }
      }
    );

    const results = await Promise.all(uploadPromises);
    const validResults: ISocialMediaUploadResponse[] = results.filter(
      (result): result is ISocialMediaUploadResponse => result !== null
    );

    if (validResults.length == 0) return validResults;
    await Promise.all(validResults.map(r => this._contentRepository.changePlatformStatus(user.orgId, r.id, r.name, r.status)));


    const failedUploads = results.filter((result) => result!.status === "failed");

    if (failedUploads.length > 0) {
      const html = `<h3>Failed Uploads</h3><ul>${failedUploads
        .map((f) => `<li>${f.name} (ID: ${f.id}) - ${f.status}</li>`)
        .join("")}</ul>`;
      await sendMail(
        user.email,
        "Failed to Upload Contents",
        html,
        (err: unknown, info: unknown) => {
          if (err) {
            console.log("Error sending mail to user");
          } else {
            console.log("Mail sended succeessfully");
          }
        }
      );
    }


    return validResults;
  }

  async getMetaPagesDetails(orgId: string, role: string, userId: string): Promise<IMetaAccount[]> {
      const user =
        role === "agency"
          ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
          : await this._clientTenantRepository.getClientById(orgId, userId);
      const accessToken = 
      user.social_credentials?.facebook?.accessToken != ""
      ? user.social_credentials.facebook?.accessToken
      : user.social_credentials.instagram.accessToken
      console.log(accessToken,user)
    return (await getMetaPagesDetails(decryptToken(accessToken))) ?? [];
  }

  async updateContentStatus(
    orgId: string,
    contentId: string,
    status: string
  ): Promise<IBucket | null> {
    return await this._contentRepository.changeContentStatus(
      orgId,
      contentId,
      status
    );
  }

  async getContentById(
    orgId: string,
    contentId: string
  ): Promise<IBucket | null> {
    return await this._contentRepository.getContentById(orgId, contentId);
  }

  async saveSocialMediaToken(
    orgId: string,
    platform: string,
    user_id: string,
    provider: string,
    accessToken: string,
    refreshToken?: string
  ): Promise<void> {
    if (user_id) {
      let longLivingAccessToken: string = accessToken;
      let encryptedAccessToken: string, encryptedRefreshToken: string;
      
      switch (platform) {
        case "agency":
          if (
            provider == INSTAGRAM ||
            provider == FACEBOOK ||
            provider == PLATFORMS.META_ADS
          ) {
            longLivingAccessToken = await exchangeForLongLivedToken(
              accessToken
            );
          }
          encryptedAccessToken = encryptToken(longLivingAccessToken)
          encryptedRefreshToken = encryptToken(refreshToken)
          await this._agencyTenantRepository.setSocialMediaTokens(
            orgId,
            provider,
            encryptedAccessToken,
            encryptedRefreshToken
          );
          break;
        case "client":
          if (provider == INSTAGRAM || provider == FACEBOOK) {
            longLivingAccessToken = await exchangeForLongLivedToken(
              accessToken
            );
          }
          
          encryptedAccessToken = encryptToken(longLivingAccessToken)
          encryptedRefreshToken = encryptToken(refreshToken)
          await this._clientTenantRepository.setSocialMediaTokens(
            orgId,
            user_id,
            provider,
            encryptedAccessToken,
            encryptedRefreshToken
          );
          break;
        default:
          break;
      }
    }
  }

  async rescheduleContent(
    orgId: string,
    contentId: string,
    platformId: string,
    date: string
  ): Promise<void> {
    await this._contentRepository.rescheduleContent(
      orgId,
      contentId,
      platformId,
      date
    );
  }

  async rejectContent(
    orgId: string,
    content_id: string,
    reason: INote
  ): Promise<void> {
    const note = await this._noteRepository.addNote(orgId, reason);
    if (!note)
      throw new CustomError(
        "An unexpected error occured while create note please try again later..",
        500
      );
    await this._contentRepository.changeContentStatus(
      orgId,
      content_id,
      "Rejected"
    );
  }

  async getOAuthUrl(
    provider: string,
    redirectUri: string,
    state?: string
  ): Promise<string> {
    switch (provider) {
      case PLATFORMS.INSTAGRAM:
        return await createInstagramOAuthURL(redirectUri);
      case PLATFORMS.FACEBOOK:
        return await createFacebookOAuthURL(redirectUri);
      case PLATFORMS.LINKEDIN:
        return await createLinkedInOAuthURL(redirectUri, state);
      case PLATFORMS.X:
        return await createXAuthURL(redirectUri, state);
      case PLATFORMS.GMAIL:
        return await createGoogleOAuthURL(redirectUri);
      case PLATFORMS.META_ADS:
        return await createMetaAdsOAuthURL(redirectUri);
      default:
        throw new Error("Unsupported platform");
    }
  }
}
