import { inject, injectable } from "tsyringe";
import { IEntityService } from "../Interface/IEntityService";
import { IEntityRepository } from "../../repositories/Interface/IEntityRepository";
import { IPlanRepository } from "../../repositories/Interface/IPlanRepository";
import { ITransactionRepository } from "../../repositories/Interface/ITransactionRepository";
import { IProjectRepository } from "../../repositories/Interface/IProjectRepository";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IAgencyTenant } from "../../types/agency";
import { IUpdateProfile } from "../../types/common";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { CustomError } from "mern.common";
import { INoteRepository } from "../../repositories/Interface/INoteRepository";
import { getLinkedInTokenStatus } from "@/providers/linkedin";
import {
  getAllFBMedias,
  getMetaAccessTokenStatus,
} from "@/providers/meta";
import { isXAccessTokenValid } from "@/providers/x";
import { credentials, IActivity, IClientTenant, IInvoice, TransactionDoc } from "@/models";
import {
  IActivityRepository,
  IInvoiceRepository,
  ITransactionTenantRepository,
} from "@/repositories";
import { getPages } from "@/media-service/shared"
import { FilterType } from "@/types/invoice";
import { env } from "@/config";
import {
  fetchIGAccountId,
  fetchIGProfileDetails,
  getAllIGMedias,
} from "@/providers/meta/instagram";
import {
  isGmailAccessTokenValid,
  refreshGmailAccessToken,
} from "@/providers/google";
import { decryptToken, encryptToken, PLATFORMS, QueryParser, ROLES } from "@/utils";
import { isErrorWithMessage } from "@/validators";

@injectable()
export class EntityService implements IEntityService {
  private _entityRepository: IEntityRepository;
  private _planRepository: IPlanRepository;
  private _transactionRepository: ITransactionRepository;
  private _projectRepository: IProjectRepository;
  private _clientTenantRepository: IClientTenantRepository;
  private _clientRepository: IClientRepository;
  private _contentRepository: IContentRepository;
  private _agencyTenantRepository: IAgencyTenantRepository;
  private _agencyRepository: IAgencyRepository;
  private _noteRepository: INoteRepository;
  private _activityRepository: IActivityRepository;
  private _invoiceRepository: IInvoiceRepository;
  private _transactionTenantRepository: ITransactionTenantRepository;

  constructor(
    @inject("EntityRepository") entityRepository: IEntityRepository,
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("TransactionRepository")
    transactionRepository: ITransactionRepository,
    @inject("ProjectRepository") projectRepository: IProjectRepository,
    @inject("ClientTenantRepository")
    clientTenantRepository: IClientTenantRepository,
    @inject("ClientRepository") clientRepository: IClientRepository,
    @inject("ContentRepository") contentRepository: IContentRepository,
    @inject("AgencyTenantRepository")
    agencyTenantRepository: IAgencyTenantRepository,
    @inject("AgencyRepository") agencyRepository: IAgencyRepository,
    @inject("NoteRepository") noteRepository: INoteRepository,
    @inject("ActivityRepository") activityRepository: IActivityRepository,
    @inject("InvoiceRepository") invoiceRepository: IInvoiceRepository,
    @inject("TransactionTenantRepository")
    transactionTenantRepository: ITransactionTenantRepository
  ) {
    this._entityRepository = entityRepository;
    this._planRepository = planRepository;
    this._transactionRepository = transactionRepository;
    this._projectRepository = projectRepository;
    this._clientTenantRepository = clientTenantRepository;
    this._clientRepository = clientRepository;
    this._contentRepository = contentRepository;
    this._agencyTenantRepository = agencyTenantRepository;
    this._agencyRepository = agencyRepository;
    this._noteRepository = noteRepository;
    this._activityRepository = activityRepository;
    this._invoiceRepository = invoiceRepository;
    this._transactionTenantRepository = transactionTenantRepository;
  }


  async getAllInvoices(
    orgId: string,
    role: string,
    user_id: string,
    query: FilterType
  ): Promise<{ invoices: IInvoice[]; totalCount: number; totalPages: number }> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["client.clientName", "client.email", "invoiceNumber"],
      additionalFilters: {
        ...(query.status === "paid" && { isPaid: true }),
        ...(query.status === "unpaid" && { isPaid: false }),
        ...(query.type === "true" && {
          dueDate: { $lt: new Date() },
          isPaid: false,
        }),
        ...(role !== ROLES.AGENCY && { "client.clientId": user_id }),
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
    const invoices = await this._invoiceRepository.getAllInvoices(
      orgId,
      filter,
      options
    );
    return invoices;
  }

  async getAllTransactions(
    orgId: string,
    role: string,
    user_id: string,
    query: FilterType
  ): Promise<{ transactions: TransactionDoc[], totalCount: number ,totalPages: number }> {
    const { page, limit, sortBy, sortOrder, type } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: [
        "email",
        "transactionId",
        "description",
        "paymentGateway",
        "transactionType",
      ],
      additionalFilters: {
        ...(role !== ROLES.AGENCY && { userId: user_id }),
        ...(type && { transactionType: type }),
      },
    });

    const options = {
      page,
      limit,
      sort: sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {},
    };
    const transactions =
      await this._transactionTenantRepository.getAllTransactions(
        orgId,
        filter,
        options
      );
    return transactions;
  }

  async getAllActivities(
    orgId: string,
    entity: string,
    user_id: string
  ): Promise<IActivity[]> {
    let activities;
    if (entity == "agency") {
      activities = await this._activityRepository.getActivities({ orgId });
    } else {
      activities = await this._activityRepository.getActivitiesByUserId(
        orgId,
        user_id
      );
    }

    return activities;
  }



  async updateProfile(
    orgId: string,
    role: string,
    requestRole: string,
    details: IUpdateProfile
  ): Promise<IAgencyTenant | IClientTenant> {
    let updatedProfile;
    if (role == "agency") {
      await this._agencyRepository.updateProfile(orgId, details);
      updatedProfile = await this._agencyTenantRepository.updateProfile(
        orgId,
        details
      );
    } else if (
      (role == "client" && requestRole == "agency") ||
      requestRole == "client"
    ) {
      await this._clientRepository.updateProfile(details);
      updatedProfile = await this._clientTenantRepository.updateProfile(
        orgId,
        details
      );
    }
    if (!updatedProfile)
      throw new CustomError(
        "An unexpected error occured while updating profile , try again later.",
        500
      );
    return updatedProfile;
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
    ...((connectionType == "social" || connectionType == "all" || connectionType == "pages")
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
    ...((connectionType == "all" || connectionType === "gmail")
      ? [
          {
            key: "gmail",
            tokens: credentials?.gmail,
            connectedAt: credentials?.gmail?.connectedAt,
            checkStatus: isGmailAccessTokenValid,
          },
        ]
      : []),
    ...((connectionType == "all" || connectionType === "ads")
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
  console.log(platforms,"platformsss")

  const validConnections = [];

  for (const platform of platforms) {
    if (platform.tokens?.accessToken && platform.tokens.accessToken !== "") {
      const tokens = {
        accessToken: decryptToken(platform.tokens.accessToken),
        refreshToken: decryptToken(platform.tokens.refreshToken || ""),
      }
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
          const newEncryptedAccessToken = encryptToken(refreshResult.accessToken)

          if (refreshResult) {
            await this._agencyTenantRepository.setSocialMediaTokens(
              orgId,
              "gmail",
              newEncryptedAccessToken,
              platform.tokens.refreshToken
            );
            platform.tokens.accessToken = refreshResult.accessToken;
            isValid = await platform.checkStatus(
              {
              accessToken: refreshResult.accessToken,
              refreshToken: tokens.refreshToken
            }
            );
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


  async getMedia(
    orgId: string,
    entity: string,
    userId: string,
    selectedPlatforms: string[],
    selectedPages: string[]
  ): Promise<object[]> {
    try {
      const user =
        entity === "agency"
          ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
          : await this._clientTenantRepository.getClientById(orgId, userId);

      const medias= [];

      for (const platform of selectedPlatforms) {
        let contents = [];

        if (platform === "instagram") {
          if (!user?.social_credentials?.instagram?.accessToken) return [];
          const token = decryptToken(user.social_credentials.instagram.accessToken)
          const pages = await getPages(token);
          const selectedPagesDetails = pages.data.filter((item) =>
            selectedPages.includes(item.id)
          );

          for (const selectedPage of selectedPagesDetails) {
            const pageAccessToken = selectedPage.access_token;
            const pageId = selectedPage.id;
            const pageName = selectedPage.name;

            const igAccountData = await fetchIGAccountId(
              pageId,
              pageAccessToken
            );

            if (igAccountData.isBusiness) {
              const igUserId = igAccountData.id;
              const igProfile = await fetchIGProfileDetails(igUserId,pageAccessToken)
              let allMedia = await getAllIGMedias(igUserId,pageAccessToken);

              contents = allMedia.map((content) => ({
                ...content,
                platform: PLATFORMS.INSTAGRAM,
                pageId,
                profileName: igProfile.username,
                profilePicture: igProfile.profile_picture_url,
              }));
              medias.push(...contents);
            }
          }
        } else if (platform === "facebook") {
          if (!user?.social_credentials?.facebook?.accessToken) return [];
          const token = decryptToken(user.social_credentials.facebook.accessToken)
          const pagesData = await getPages(token)
          const selectedPagesDetails = (pagesData.data || []).filter(
            (page) => selectedPages.includes(page.id)
          );

          for (const selectedPage of selectedPagesDetails) {
            const pageAccessToken = selectedPage.access_token;
            const pageId = selectedPage.id;

            const pageInfoResponse = await fetch(
              `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}?fields=name,picture&access_token=${pageAccessToken}`
            );
            const pageInfo = await pageInfoResponse.json();
            let allPosts = await getAllFBMedias(pageId,pageAccessToken)
            contents = allPosts.map((post) => ({
              id: post.id,
              caption: post.message || post.story || "",
              media_type:
                post.attachments?.data[0]?.type == "photo" ? "IMAGE" : "VIDEO",
              media_url:
                post.attachments?.data[0]?.media?.image?.src ||
                post.attachments?.data[0]?.media?.source ||
                "",
              permalink: post.permalink_url,
              timestamp: post.created_time,
              platform: PLATFORMS.FACEBOOK,
              pageId,
              profileName: pageInfo.name,
              profilePicture: pageInfo.picture?.data?.url || null,
            }));

            medias.push(...contents);
          }
        }
      }

      return medias;
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
      console.error("Error fetching inbox:", errorMessage);
      throw new CustomError("Error while fetching chats", 500);
    }
  }



      async getCalenderEvents(orgId: string, role: string, userId: string): Promise<{ _id: string; title: string; from: string | Date; to: string | Date; }[]> {
        let clients: IClientTenant[] = [];
        console.log(role,"rollleeedde",userId)
      
        if (role === ROLES.AGENCY) {
          const { data } = await this._clientTenantRepository.getAllClients(orgId);
          clients = data;
        } else {
          const client = await this._clientTenantRepository.getClientById(orgId, userId);
          if (client) clients.push(client);
        }
      
        const events: { _id: string; title: string; from: string | Date; to: string | Date; }[] = [];
      
        for (const client of clients) {
          const projects = await this._projectRepository.getProjectsByClientId(orgId, client._id.toString());
          if (projects) {
            projects.forEach((p, idx) => {
              events.push({
                _id: `project-${client._id}-${idx}`,
                title: `Project: ${p.service_name}`,
                from: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
                to: p.dead_line ? new Date(p.dead_line).toISOString() : new Date().toISOString(),
              });
            });
          }
      
          const scheduledContents = await this._contentRepository.getAllScheduledContents(orgId, client._id.toString());

          if (scheduledContents) {
            scheduledContents.forEach((sc, idx) => {
              const scheduledDate = sc.platforms?.[0]?.scheduledDate;
          
              if (scheduledDate && scheduledDate.trim() !== "") {
                events.push({
                  _id: `content-${client._id}-${idx}`,
                  title: `Scheduled Content: ${sc.title}`,
                  from: sc.createdAt ? new Date(sc.createdAt).toISOString() : new Date().toISOString(),
                  to: new Date(scheduledDate).toISOString(),
                });
              }
            });
          }
          
          const { invoices } = await this._invoiceRepository.getAllInvoices(orgId, { "client.clientId": client._id.toString() });
          if (invoices) {
            invoices.forEach((inv, idx) => {
              events.push({
                _id: `invoice-${client._id}-${idx}`,
                title: `Invoice: ${inv.invoiceNumber} (${inv.isPaid ? "Paid" : "Unpaid"})`,
                from: inv.createdAt ? new Date(inv.createdAt).toISOString() : new Date().toISOString(),
                to: inv.dueDate ? new Date(inv.dueDate).toISOString() : new Date().toISOString(),
              });        
            });
          }
        }
      
        return events;
      }
}
