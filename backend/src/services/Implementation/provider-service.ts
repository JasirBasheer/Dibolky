import { inject, injectable } from "tsyringe";
import { IProviderService } from "../Interface/IProviderService";
import {
  createFacebookOAuthURL,
  createMetaAdsOAuthURL,
  getAdAccounts,
  handleFacebookUpload,
} from "@/providers/meta";
import {
  createInstagramOAuthURL,
  deleteIGComment,
  exchangeForLongLivedToken,
  getIGComments,
  getIGInsights,
  getIGMedias,
  getIGReplies,
  handleInstagramUpload,
  setIGCommentHidden,
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
  ROLES,
  X,
} from "../../utils/constants";
import { IBucketWithReason, INote } from "../../types/note";
import { INoteRepository } from "../../repositories/Interface/INoteRepository";
import { CustomError, NotFoundError, sendMail } from "mern.common";
import { handleLinkedinUpload } from "@/providers/linkedin/handler";
import { createXAuthURL, handleXUpload, isXAccessTokenValid } from "@/providers/x";
import {
  deleteFBComment,
  getFBComments,
  getFBInsights,
  getFBMedia,
  getFBReplies,
  getMetaAccessTokenStatus,
  getMetaPagesDetails,
  setFBCommentHidden,
} from "@/providers/meta/facebook";
import { credentials, IClientTenant } from "@/models";
import { createLinkedInOAuthURL, getLinkedInTokenStatus } from "@/providers/linkedin";
import { createGoogleOAuthURL, isGmailAccessTokenValid, refreshGmailAccessToken } from "@/providers/google";
import { decryptToken, encryptToken, FilterType, QueryParser } from "@/utils";
import { getPages } from "@/media-service/shared";
import { getSupportedMetrics } from "@/providers/utils";
import { getFBMediaDetails } from "@/providers/utils/facebook";
import { isErrorWithMessage } from "@/validators";
import { SaveContentDto } from "@/dtos/content";
import { CommonMapper } from "@/mappers/common-mapper";

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
              if (!access_token)
                throw new Error("Instagram access token not found");
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
              return (response = await handleXUpload(
                content,
                decryptToken(access_token)
              ));

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
    await Promise.all(
      validResults.map((r) =>
        this._contentRepository.changePlatformStatus(
          user.orgId,
          r.id,
          r.name,
          r.status
        )
      )
    );

    const failedUploads = results.filter(
      (result) => result!.status === "failed"
    );

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

  async getMetaPagesDetails(
    orgId: string,
    role: string,
    userId: string
  ): Promise<IMetaAccount[]> {
    const user =
      role === "agency"
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);
    const accessToken =
      user.social_credentials?.facebook?.accessToken != ""
        ? user.social_credentials.facebook?.accessToken
        : user.social_credentials.instagram.accessToken;
    console.log(accessToken, user);
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
          encryptedAccessToken = encryptToken(longLivingAccessToken);
          encryptedRefreshToken = encryptToken(refreshToken);
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

          encryptedAccessToken = encryptToken(longLivingAccessToken);
          encryptedRefreshToken = encryptToken(refreshToken);
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

  private async getValidConnections(
    orgId: string,
    credentials: Record<string, credentials>,
    connectionType: string
  ): Promise<
    {
      platform: string;
      isValid: boolean;
      connectedAt: string | undefined;
    }[]
  > {
    const platforms = [
      ...(connectionType == "social" ||
      connectionType == "all" ||
      connectionType == "pages"
        ? [
            {
              key: "facebook",
              tokens: credentials?.facebook,
              connectedAt: credentials?.facebook?.connectedAt,
              checkStatus: getMetaAccessTokenStatus,
            },
            {
              key: "instagram",
              tokens: credentials?.instagram,
              connectedAt: credentials?.instagram?.connectedAt,
              checkStatus: getMetaAccessTokenStatus,
            },
            {
              key: "linkedin",
              tokens: credentials?.linkedin,
              connectedAt: credentials?.linkedin?.connectedAt,
              checkStatus: getLinkedInTokenStatus,
            },
            {
              key: "x",
              tokens: credentials?.x,
              connectedAt: credentials?.x?.connectedAt,
              checkStatus: isXAccessTokenValid,
            },
          ]
        : []),
      ...(connectionType == "all" || connectionType === "gmail"
        ? [
            {
              key: "gmail",
              tokens: credentials?.gmail,
              connectedAt: credentials?.gmail?.connectedAt,
              checkStatus: isGmailAccessTokenValid,
            },
          ]
        : []),
      ...(connectionType == "all" || connectionType === "ads"
        ? [
            {
              key: "meta_ads",
              tokens: credentials?.meta_ads,
              connectedAt: credentials?.meta_ads?.connectedAt,
              checkStatus: getMetaAccessTokenStatus,
            },
          ]
        : []),
    ];

    const validConnections = [];

    for (const platform of platforms) {
      if (platform.tokens?.accessToken && platform.tokens.accessToken !== "") {
        const tokens = {
          accessToken: decryptToken(platform.tokens.accessToken),
          refreshToken: decryptToken(platform.tokens.refreshToken || ""),
        };
        let isValid = await platform.checkStatus(tokens);

        if (
          platform.key === "gmail" &&
          !isValid &&
          platform.tokens.refreshToken
        ) {
          try {
            const refreshResult = await refreshGmailAccessToken(
              tokens.refreshToken
            );
            const newEncryptedAccessToken = encryptToken(
              refreshResult.accessToken
            );

            if (refreshResult) {
              await this._agencyTenantRepository.setSocialMediaTokens(
                orgId,
                "gmail",
                newEncryptedAccessToken,
                platform.tokens.refreshToken
              );
              platform.tokens.accessToken = refreshResult.accessToken;
              isValid = await platform.checkStatus({
                accessToken: refreshResult.accessToken,
                refreshToken: tokens.refreshToken,
              });
            }
          } catch (error) {
            console.error("Error refreshing Gmail token:", error);
            isValid = false;
          }
        }

        validConnections.push({
          platform: platform.key,
          is_valid: isValid,
          connectedAt: platform.connectedAt,
        });
      }
    }

    return validConnections;
  }

  async getContentDetails(
    orgId: string,
    entity: string,
    userId: string,
    platform: string,
    mediaId: string,
    mediaType: string,
    pageId: string
  ): Promise<any> {
    try {
      const user =
        entity === "agency"
          ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
          : await this._clientTenantRepository.getClientById(orgId, userId);

      if (!user) throw new Error("User not found");

      let contentDetails = {};

      if (platform === PLATFORMS.INSTAGRAM) {
        const accessToken = decryptToken(
          user.social_credentials.instagram?.accessToken
        );
        if (!accessToken) throw new Error("Instagram access token missing");

        const pages = await getPages(accessToken);
        const page = pages.data.find((p) => p.id == pageId);
        const comments = await getIGComments(mediaId, page.access_token);

        const commentsWithReplies = await Promise.all(
          comments.map(async (comment) => {
            const replies = await getIGReplies(comment.id, page.access_token);
            return { ...comment, replies };
          })
        );

        const media = await getIGMedias(mediaId, page.access_token);
        const metrics = getSupportedMetrics(media.media_type || mediaType);
        const insights = await getIGInsights(
          mediaId,
          page.access_token,
          metrics
        );

        contentDetails = {
          media: { ...media, platform: PLATFORMS.INSTAGRAM, pageId },
          comments: commentsWithReplies || [],
          insights,
        };
      } else if (platform === PLATFORMS.FACEBOOK) {
        const accessToken = decryptToken(
          user.social_credentials.facebook?.accessToken
        );
        if (!accessToken) throw new Error("Facebook access token missing");

        const pages = await getPages(accessToken);
        const page = pages.data.find((p) => p.id == pageId);

        const comments = await getFBComments(mediaId, page.access_token);
        const commentsWithReplies = await Promise.all(
          comments.map(async (comment) => {
            const replies = await getFBReplies(comment.id, page.access_token);
            return { ...comment, replies };
          })
        );

        const content = await getFBMedia(mediaId, page.access_token);
        const { media_type, media_url } = getFBMediaDetails(content);
        const insights = await getFBInsights(mediaId, page.access_token);

        contentDetails = {
          media: {
            ...content,
            caption: content.message || content.story || "",
            media_type: ["video", "reel"].includes(media_type)
              ? "VIDEO"
              : "IMAGE",
            permalink: content.permalink_url,
            timestamp: content.created_time,
            media_url,
            platform: PLATFORMS.FACEBOOK,
            pageId: page.id,
            pageName: page.name,
            username: page.name,
          },
          comments: commentsWithReplies || [],
          insights,
        };
      }

      return contentDetails;
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : "Unknown error";
      console.error("Error fetching content details:", errorMessage);
      throw new CustomError("Error while fetching content details", 500);
    }
  }

  async replayToComments(
    orgId: string,
    entity: string,
    userId: string,
    platform: string,
    commentId: string,
    pageId: string,
    replyMessage: string
  ): Promise<any> {
    try {
      const user =
        entity === "agency"
          ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
          : await this._clientTenantRepository.getClientById(orgId, userId);

      if (!user) {
        throw new Error("User not found");
      }

      if (!replyMessage || replyMessage.trim() === "") {
        throw new Error("Reply message cannot be empty");
      }

      if (platform === "instagram") {
        const instagramAccessToken = decryptToken(
          user.social_credentials.instagram?.accessToken
        );
        if (!instagramAccessToken) {
          throw new Error("Instagram access token missing");
        }

        const pages = await getPages(instagramAccessToken);
        const page = pages.data.find((p) => p.id == pageId);

        const response = await fetch(
          `https://graph.facebook.com/v19.0/${commentId}/replies?message=${replyMessage}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              access_token: page.access_token,
            }),
          }
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(`Instagram API error: ${data.error.message}`);
        }

        return data;
      } else if (platform === "facebook") {
        const facebookAccessToken = decryptToken(
          user.social_credentials.facebook?.accessToken
        );
        if (!facebookAccessToken) {
          throw new Error("Facebook access token missing");
        }

        const pages = await getPages(facebookAccessToken);
        const page = pages.data.find((p) => p.id == pageId);

        const response = await fetch(
          `https://graph.facebook.com/${commentId}/comments?message=${encodeURIComponent(
            replyMessage
          )}&access_token=${page.access_token}`,
          {
            method: "POST",
          }
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(`Facebook API error: ${data.error.message}`);
        }

        return data;
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : "Unknown error";
      console.error("Error replying to comment:", error);
      throw new CustomError(errorMessage, 500);
    }
  }

  async deleteComment(
    orgId: string,
    user_id: string,
    entity: string,
    pageId: string,
    platform: string,
    commentId: string
  ): Promise<{ success: boolean }> {
    const user =
      entity === "agency"
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, user_id);
    const accessToken =
      platform == "facebook"
        ? user.social_credentials.facebook.accessToken
        : user.social_credentials.instagram.accessToken;
    const decryptedAccessToken = decryptToken(accessToken);
    const pages = await getPages(decryptedAccessToken);
    const page = pages.data.find((p) => p.id == pageId);

    const deletedComment =
      platform == "facebook"
        ? await deleteFBComment(commentId, page.access_token)
        : await deleteIGComment(commentId, page.access_token);
    return deletedComment;
  }

  async hideComment(
    orgId: string,
    user_id: string,
    entity: string,
    pageId: string,
    platform: string,
    commentId: string
  ): Promise<{ success: boolean }> {
    const user =
      entity === "agency"
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, user_id);
    const accessToken =
      platform == "facebook"
        ? user.social_credentials.facebook.accessToken
        : user.social_credentials.instagram.accessToken;

    const decryptedAccessToken = decryptToken(accessToken);
    const pages = await getPages(decryptedAccessToken);
    const page = pages.data.find((p) => p.id == pageId);

    console.log(platform, "test", entity, "entity");
    const hiddenComment =
      platform == "facebook"
        ? await setFBCommentHidden(commentId, page.access_token)
        : await setIGCommentHidden(commentId, page.access_token);
    return hiddenComment;
  }

  async saveContent(payload: SaveContentDto): Promise<IBucket> {
    const {
      orgId,
      platform,
      platforms,
      user_id,
      files,
      metadata,
      contentType,
    } = payload;
    let detials;
    if (platform == "agency") {
      const ownerDetials = await this._agencyTenantRepository.getOwners(orgId);
      detials = {
        user_id: ownerDetials![0]._id as string,
        orgId,
        files,
        platforms,
        title: metadata.title,
        caption: metadata.caption,
        tags: metadata.tags,
        metaAccountId: metadata.metaAccountId,
        contentType,
      };
    } else if (platform == "client") {
      detials = {
        user_id,
        orgId,
        files,
        platforms,
        title: metadata.title,
        caption: metadata.caption,
        tags: metadata.tags,
        metaAccountId: metadata.metaAccountId,
        contentType,
      };
    } else {
      detials = {
        user_id,
        orgId,
        files,
        platforms,
        title: metadata.title,
        caption: metadata.caption,
        tags: metadata.tags,
        metaAccountId: metadata.metaAccountId,
        contentType,
      };
    }
    return this._contentRepository.saveContent(detials);
  }

  async fetchContents(
    orgId: string,
    role: string,
    userId: string,
    query: FilterType
  ): Promise<{
    contents: IBucketWithReason[];
    totalCount: number;
    totalPages: number;
  }> {
    const { page, limit, sortBy, sortOrder } = query;
    const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["title", "caption", "status"],
      additionalFilters: {
        ...(query.status && query.status !== "all"
          ? { status: query.status }
          : {}),
        ...(role == ROLES.AGENCY
          ? { user_id: owner._id }
          : { user_id: userId }),
      },
    });
    const options = {
      page,
      limit,
      sort: sortBy
        ? ({ [sortBy]: sortOrder === "desc" ? -1 : 1 } as Record<
            string,
            1 | -1
          >)
        : {},
    };

    const result = await this._contentRepository.getContentsByUserId(
      orgId,
      filter,
      options
    );
    const contentIds = result.contents.map((content) => String(content._id));
    const notes = await this._noteRepository.getContentNotesByEntityIds(
      orgId,
      contentIds
    );

    const contentsWithNotes = result.contents.map((contentDoc) => {
      const content = contentDoc.toObject();
      const matchingNote = notes.find(
        (note) => note.entityId.toString() === content._id.toString()
      );
      return {
        ...content,
        _id: content._id.toString(),
        reason: matchingNote || null,
      } as IBucketWithReason;
    });

    console.log(contentsWithNotes);

    return CommonMapper.ContentDetails({
      ...result,
      contents: contentsWithNotes,
    });
  }

  async getScheduledContent(
    orgId: string,
    user_id: string
  ): Promise<IBucket[]> {
    return await this._contentRepository.getAllScheduledContents(
      orgId,
      user_id
    );
  }

  async getConnections(
    orgId: string,
    entity: string,
    userId: string,
    includes: string
  ): Promise<{
    validConnections: {
      platform: string;
      is_valid: boolean;
      connectedAt: string | undefined;
    }[];
    connectedPages: { name: string; id: string }[];
    adAccounts: { name: string; id: string; act: string }[];
  }> {
    const userDetails =
      entity === "agency"
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);

    if (!userDetails) {
      throw new NotFoundError(
        "User details not found, please try again later."
      );
    }

    let validConnections = [];

    if (
      includes == "all" ||
      includes == "pages" ||
      includes == "social" ||
      includes == "gmail" ||
      includes == "ads"
    ) {
      validConnections = await this.getValidConnections(
        orgId,
        userDetails.social_credentials,
        includes
      );
    }

    let connectedPages: { name: string; id: string }[] = [];
    if (
      (includes == "pages" || includes == "all") &&
      validConnections.some(
        (conn) =>
          (conn.platform === "facebook" || conn.platform === "instagram") &&
          conn.is_valid
      )
    ) {
      const token =
        userDetails.social_credentials?.facebook?.accessToken ||
        userDetails.social_credentials?.instagram?.accessToken;

      const decryptedToken = decryptToken(token);

      if (decryptedToken) {
        try {
          const pagesResponse = await getPages(decryptedToken);
          connectedPages = pagesResponse.data.map((page) => ({
            name: page.name,
            id: page.id,
          }));
        } catch (error) {
          console.error("Failed to fetch connected pages:", error);
        }
      }
    }

    let adAccounts: { name: string; id: string; act: string }[] = [];
    if (
      (includes == "ads" || includes === "all") &&
      validConnections.some(
        (conn) => conn.platform == "meta_ads" && conn.is_valid
      )
    ) {
      const adsToken = userDetails.social_credentials?.meta_ads?.accessToken;
      const decryptedAdsToken = decryptToken(adsToken);
      if (decryptedAdsToken) {
        try {
          adAccounts = await getAdAccounts(decryptedAdsToken);
        } catch (error) {
          console.error("Failed to fetch ads accounts:", error);
        }
      }
    }

    return {
      validConnections,
      connectedPages,
      adAccounts,
    };
  }
}
