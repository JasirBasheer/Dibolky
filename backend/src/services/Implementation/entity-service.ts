import { inject, injectable } from "tsyringe";
import { IEntityService } from "../Interface/IEntityService";
import { IEntityRepository } from "../../repositories/Interface/IEntityRepository";
import { IPlanRepository } from "../../repositories/Interface/IPlanRepository";
import { agencyTenantSchema } from "../../models/Implementation/agency";
import { ITransactionRepository } from "../../repositories/Interface/ITransactionRepository";
import { IProject } from "../../models/Implementation/project";
import { IProjectRepository } from "../../repositories/Interface/IProjectRepository";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IAgencyType, IAgencyTenant } from "../../types/agency";
import { connectTenantDB } from "../../config/db.config";
import {
  IBucket,
  IUpdateProfile,
  IMenu,
} from "../../types/common";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { getS3ViewUrl } from "../../utils/aws.utils";
import { addMonthsToDate } from "../../utils/date-utils";
import { CustomError, hashPassword, NotFoundError } from "mern.common";
import { INoteRepository } from "../../repositories/Interface/INoteRepository";
import { getLinkedInTokenStatus } from "@/providers/linkedin";
import { getIGTokenDetails, getMetaAccessTokenStatus } from "@/providers/facebook";
import { isXAccessTokenValid } from "@/providers/x";
import { IAgencyRegistrationDto } from "@/dto";
import { SaveContentDto } from "@/dto/content";
import { IClientTenant } from "@/models";
import { IActivityRepository, IInvoiceRepository, ISocialMessageRepository, ISocialUserRepository, ITransactionTenantRepository } from "@/repositories";
import { getPages } from "@/media-service/shared";
import { getIGConversations, getIGMessages, getIGMessageSenderDetails } from "@/inbox-integrations";
import { InstagramConversation, InstagramMessage, ISocialUserType } from "@/types";
import { FilterType } from "@/types/invoice";
import { META_API_VERSION } from "@/config";
import { fetchIGAccountId } from "@/providers/instagram";

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
  private _socialUserRepository: ISocialUserRepository;
  private _socialMessageRepository: ISocialMessageRepository;
  private _invoiceRepository: IInvoiceRepository;
  private _transactionTenantRepository: ITransactionTenantRepository

  constructor(
    @inject("EntityRepository") entityRepository: IEntityRepository,
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("TransactionRepository")transactionRepository: ITransactionRepository,
    @inject("ProjectRepository") projectRepository: IProjectRepository,
    @inject("ClientTenantRepository")clientTenantRepository: IClientTenantRepository,
    @inject("ClientRepository") clientRepository: IClientRepository,
    @inject("ContentRepository") contentRepository: IContentRepository,
    @inject("AgencyTenantRepository")agencyTenantRepository: IAgencyTenantRepository,
    @inject("AgencyRepository") agencyRepository: IAgencyRepository,
    @inject("NoteRepository") noteRepository: INoteRepository,
    @inject("ActivityRepository") activityRepository: IActivityRepository,
    @inject("SocialUserRepository") socialUserRepository: ISocialUserRepository,
    @inject("SocialMessageRepository") socialMessageRepository: ISocialMessageRepository,
    @inject("InvoiceRepository") invoiceRepository: IInvoiceRepository,
    @inject("TransactionTenantRepository") transactionTenantRepository: ITransactionTenantRepository,

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
    this._socialUserRepository = socialUserRepository;
    this._socialMessageRepository = socialMessageRepository;
    this._invoiceRepository = invoiceRepository;
    this._transactionTenantRepository = transactionTenantRepository;
  }

  async fetchAllProjects(
    orgId: string,
    page?: number
  ): Promise<{ projects: IProject[]; totalPages: number } | null> {
    return await this._projectRepository.fetchAllProjects(orgId, page);
  }

  async IsMailExists(mail: string): Promise<boolean> {
    const isExists = await this._entityRepository.isAgencyMailExists(mail);
    if (isExists) return true;
    return false;
  }

  async createAgency(
    payload: IAgencyRegistrationDto
  ): Promise<Partial<IAgencyType> | null> {
    const {
      organizationName,
      name,
      email,
      address,
      websiteUrl,
      industry,
      contactNumber,
      logo,
      password,
      planId,
      validity,
      planPurchasedRate,
      transactionId,
      paymentGateway,
      description,
      currency,
    } = payload;

    const hashedPassword = await hashPassword(password);
    let orgId =
      organizationName.replace(/\s+/g, "") +
      Math.floor(Math.random() * 1000000);
    let validityInDate = addMonthsToDate(validity);

    const newAgency = {
      orgId,
      planId,
      validity: validityInDate,
      organizationName,
      name,
      email,
      address,
      websiteUrl,
      industry,
      contactNumber,
      logo,
      password: hashedPassword,
      planPurchasedRate: planPurchasedRate,
      currency,
    };

    const ownerDetails = await this._entityRepository.createAgency(newAgency);

    const newTenantAgency = {
      main_id: ownerDetails?._id,
      orgId,
      planId,
      organizationName,
      name,
      email,
    };

    const newTransaction = {
      orgId,
      email,
      userId: ownerDetails?._id,
      planId,
      paymentGateway,
      transactionId,
      amount: planPurchasedRate,
      description,
      currency,
      transactionType:"plan_transactions"
    };

    const activity = {
      user: {
        userId: ownerDetails._id as string,
        username: organizationName,
        email,
      },
      activityType: "account_created",
      activity: "Account created for agency",
      entity: {
        type: "agency",
      },
      redirectUrl: "settings",
    };

    this._transactionRepository.createTransaction(newTransaction);
    this._transactionTenantRepository.createTransaction(orgId,newTransaction);
    this._activityRepository.createActivity(orgId, activity);
    await this._entityRepository.saveDetailsInAgencyDb(
      newTenantAgency,
      orgId as string
    );
    return ownerDetails;
  }

  async getMenu(planId: string): Promise<IMenu[]> {
    const plan = await this._planRepository.getPlan(planId);
    if (!plan) throw new CustomError("Plan not found", 500);
    return plan.menu as IMenu[];
  }

  async getClientMenu(orgId: string, client_id: string): Promise<IMenu[]> {
    const client = await this._clientTenantRepository.getClientById(
      orgId,
      client_id
    );
    if (!client || !client.menu)
      throw new CustomError("Client menu not found", 500);
    return client?.menu;
  }



  async getAllInvoices(orgId: string,role: string, user_id: string, query:FilterType): Promise<any>{
    const { page, limit, sortBy, sortOrder } = query;
    const filter = this._buildInvoiceFilter(query,role,user_id,)
    const options = { page, limit, sort: sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {}};
    const invoices = await this._invoiceRepository.getAllInvoices(orgId,filter,options) 
    return invoices
  }

    async getAllTransactions(orgId: string,role: string, user_id: string,query:FilterType): Promise<any>{
    const { page, limit, sortBy, sortOrder , type} = query;
    const filter = this._buildTransactionFilter(query,role,user_id,type)
    const options = { page, limit, sort: sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {}};
    const transactions = await this._transactionTenantRepository.getAllTransactions(orgId,filter,options) 
    return transactions
  }

    async getAllActivities(orgId: string,entity: string, user_id: string): Promise<any>{
      let activities;
      if(entity == "agency"){
        activities = await this._activityRepository.getActivities({orgId}) 
      }else{
        activities = await this._activityRepository.getActivitiesByUserId(orgId,user_id) 
      }
        
    return activities
  }

  
  
private _buildInvoiceFilter(
  query: FilterType,
  role: string,
  user_id: string
): Record<string, unknown> {
  const { query: searchText, status, overdues } = query;
  const filter: Record<string, unknown> = {};

  if (searchText) {
    filter.$or = [
      { "client.clientName": { $regex: searchText, $options: "i" } },
      { "client.email": { $regex: searchText, $options: "i" } },
      { invoiceNumber: { $regex: searchText, $options: "i" } },
    ];
  }

  if (status === "paid") filter.isPaid = true;
  if (status === "unpaid") filter.isPaid = false;

  if (role !== "agency") {
    filter["client.clientId"] = user_id;
  }

  if (overdues === "true" || overdues === true) {
    filter.dueDate = { $lt: new Date() };
    filter.isPaid = false; 
  }

  return filter;
}


private _buildTransactionFilter(
  query: FilterType,
  role: string,
  user_id: string,
  transactionType:string
): Record<string, unknown> {
  const { query: searchText } = query;
  const filter: Record<string, unknown> = {};

  if (searchText) {
    filter.$or = [
      { email: { $regex: searchText, $options: "i" } },
      { transactionId: { $regex: searchText, $options: "i" } },
      { description: { $regex: searchText, $options: "i" } },
      { paymentGateway: { $regex: searchText, $options: "i" } },
      { transactionType: { $regex: searchText, $options: "i" } },
    ];
  }
  filter.transactionType = transactionType
  if (role !== "agency") {
    filter.userId = user_id;
  }

  return filter;
}




  async getOwner(orgId: string): Promise<IAgencyTenant[]> {
    const tenantDb = await connectTenantDB(orgId);
    const ownerDetailModel = tenantDb.model("OwnerDetail", agencyTenantSchema);
    return await this._entityRepository.fetchOwnerDetails(ownerDetailModel);
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

  async getS3ViewUrl(key: string): Promise<string> {
    return await getS3ViewUrl(key);
  }

  async fetchContents(orgId: string, user_id: string): Promise<IBucket[]> {
    const contents =
      (await this._contentRepository.getContentsByUserId(orgId, user_id)) ?? [];
    const contentIds = contents.map((content) => String(content._id));
    const notes = await this._noteRepository.getContentNotesByEntityIds(
      orgId,
      contentIds
    );

    return contents.map((content) => {
      const matchingNote = notes.find(
        (note) => note.entityId.toString() === String(content._id)
      );
      return {
        ...content.toObject(),
        reason: matchingNote ? matchingNote : null,
      };
    });
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
    user_id: string
  ): Promise<any> {
    console.log('entered to get connectionssssss')
    const validConnections = [];
    const details =
      entity === "agency"
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, user_id);

    if (!details)
      throw new NotFoundError(
        "User details not found please try again later.."
      );

    const credentials = details.social_credentials;
    const platforms = [
      { key: "facebook", token: credentials?.facebook?.accessToken, connectedAt: credentials?.facebook?.connectedAt, checkStatus: getMetaAccessTokenStatus },
      { key: "instagram", token: credentials?.instagram?.accessToken, connectedAt: credentials?.instagram?.connectedAt, checkStatus: getMetaAccessTokenStatus },
      { key: "linkedin", token: credentials?.linkedin?.accessToken, connectedAt: credentials?.linkedin?.connectedAt, checkStatus: getLinkedInTokenStatus },
      { key: "x", token: credentials?.x?.accessToken, connectedAt: credentials?.x?.connectedAt, checkStatus: isXAccessTokenValid },
    ];

    for (const platform of platforms) {
      if (platform.token && platform.token !== "") {
        const isValid = await platform.checkStatus(platform.token);
        validConnections.push({
          platform: platform.key,
          is_valid: isValid,
          createdAt: platform.connectedAt,
        });
      }
    }

    let connectedPages:{name:string,id:string}[] = []
    if(validConnections.some((item)=> item.platform == "instagram" || item.platform == "facebook")){
        const token = credentials?.facebook?.accessToken ?? credentials?.instagram?.accessToken
        const pages = await getPages(token as string)
        connectedPages = pages.data.map((page)=> {return { name:page.name,id:page.id}})
     }

    return {validConnections,connectedPages};
  }
  
async getInbox(
  orgId: string,
  entity: string,
  userId: string,
  selectedPlatforms: string[],
  selectedPages: string[]
): Promise<ISocialUserType[]> {
  try {
    const user = entity === 'agency'
        ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        : await this._clientTenantRepository.getClientById(orgId, userId);

    const users: ISocialUserType[] = [];
    for (const platform of selectedPlatforms) {
      let platformUsers: ISocialUserType[] = [];

      if (platform === 'instagram') {
      if (!user?.social_credentials?.instagram?.accessToken) return []
        
        platformUsers = (
          await Promise.all(
            selectedPages.map(async (pageId) => {
              const usersWithPageId = await this._socialUserRepository.getUsersWithPageId(orgId, userId, platform, pageId);
              return usersWithPageId;
            })
          )
        ).flat();
 
        if (platformUsers.length > 0) users.push(...platformUsers);

        const pagesWithNoUsers = selectedPages.filter((pageId) => !platformUsers.some((u) => u.linkedPage === pageId));
        console.log(pagesWithNoUsers.length)
        if (pagesWithNoUsers.length > 0) {
          const pages = await getPages(user.social_credentials.instagram.accessToken);
          const validPages = pages.data.filter((page) => pagesWithNoUsers.includes(page.id));
          const pageUsers = await Promise.all(
            validPages.map(async (page) => {
              const tokenDetails = await getIGTokenDetails(page.id, page.access_token); 
              if (!tokenDetails) return [];

              const conversations = await getIGConversations(page.id, page.access_token);

              const conversationUsers = await Promise.all(
                conversations.map(async (conversation: InstagramConversation) => {
                  const messages = await getIGMessages(conversation.id, page.access_token);
                  if (!messages.length) return null;
                      const validMessages = messages.filter((msg: InstagramMessage) => 
                        msg.message.trim() !== '' || (msg.attachments && msg.attachments.data.length > 0)
                      );

                  if (validMessages.length === 0) return null;
                  const otherUser = messages.find(
                    (msg: InstagramMessage) =>
                      msg.from.id !== tokenDetails.id || msg.to.data[0].id !== tokenDetails.id)?.from.id !== tokenDetails.id
                    ? messages.find((msg: InstagramMessage) => msg.from.id !== tokenDetails.id)?.from
                    : messages.find((msg: InstagramMessage) => msg.to.data[0].id !== tokenDetails.id)?.to.data[0];

                  if (!otherUser) return null;
                  const userDetails = await getIGMessageSenderDetails(otherUser.id, page.access_token);
                  const socialUser = await this._socialUserRepository.createUser(orgId, {
                    platform, externalUserId: otherUser.id, 
                    userId,
                    conversationId: conversation.id,
                    userName: userDetails.username || userDetails.name,
                    name: userDetails.name || userDetails.username, 
                    profile: userDetails.profile_picture_url || "", 
                    linkedPage: page.id, 
                    lastSeen: new Date(messages[0].created_time), 
                     });

                     const socialMessages = messages.map((msg: InstagramMessage) => ({
                    platform,
                    userId,
                    linkedPage: page.id,
                    conversationId: conversation.id,
                    externalMessageId: msg.id,
                    senderId: msg.from.id,
                    isFromMe: msg.from.id === tokenDetails.id, 
                    content: msg.message || undefined,
                    media: msg.attachments?.data.map((att) => ({
                      id: att.id,
                      url: att.image_data?.url || '',
                    })) || [],
                    timestamp: new Date(msg.created_time),
                    status: 'received',
                  }));

                  await this._socialMessageRepository.createMessages(orgId, socialMessages);

                  return {
                    _id: socialUser._id,
                    platform,
                    externalUserId: otherUser.id,
                    userId,
                    conversationId: conversation.id,
                    name: userDetails.name || userDetails.username,
                    profile: userDetails.profile_picture_url || '',
                    linkedPage: page.id,
                    lastSeen: new Date(messages[0].created_time),
                  } as ISocialUserType;
                })
              );

              return conversationUsers.filter((u): u is ISocialUserType => u !== null);
            })
          );

          users.push(...pageUsers.flat());
        }
      } else {
        platformUsers = await this._socialUserRepository.getUsers(orgId, userId, platform);
        if (platformUsers.length > 0) {
          users.push(...platformUsers);
        }
      }
    }

    return users;
  } catch (error:any) {
    console.error('Error fetching inbox:', error);
    throw new CustomError('Error while fetching chats', 500);
  }
}





   async getInboxMessages(orgId: string,  userId: string, platform: string, conversationId: string): Promise<any>{
      const messages = await this._socialMessageRepository.getMessages(orgId,userId,platform,conversationId)
      return messages
    
   }





async getMedia(
  orgId: string,
  entity: string,
  userId: string,
  selectedPlatforms: string[],
  selectedPages: string[]
): Promise<any[]> {
  try {
    const user = entity === 'agency'
      ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
      : await this._clientTenantRepository.getClientById(orgId, userId);

    const medias: any[] = [];

    for (const platform of selectedPlatforms) {
      let contents: any[] = [];

      if (platform === 'instagram') {
        if (!user?.social_credentials?.instagram?.accessToken) return [];

        const pages = await getPages(user.social_credentials.instagram.accessToken);
        const selectedPagesDetails = pages.data.filter((item) => selectedPages.includes(item.id));

        for (const selectedPage of selectedPagesDetails) {
          const pageAccessToken = selectedPage.access_token;
          const pageId = selectedPage.id;
          const pageName = selectedPage.name

          const igAccountData = await fetchIGAccountId(pageId,pageAccessToken)

          if (igAccountData.isBusiness) {
            const igUserId = igAccountData.id;
          const igProfileResponse = await fetch(`https://graph.facebook.com/${igUserId}?fields=id,username,name,profile_picture_url&access_token=${pageAccessToken}`);
            const igProfile = await igProfileResponse.json();


            let allMedia = [];
            let nextUrl = `https://graph.facebook.com/${igUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${pageAccessToken}`;

            while (nextUrl) {
              const response = await fetch(nextUrl);
              const data = await response.json();

              allMedia.push(...(data?.data || []));
              nextUrl = data?.paging?.next || null;
            }

            contents = allMedia.map((content) => ({
              ...content,
              platform: "instagram",
              pageId,
              profileName: igProfile.username,
              profilePicture: igProfile.profile_picture_url
            }));
            medias.push(...contents);
          }
        }
      } else if (platform === 'facebook') {
        if (!user?.social_credentials?.facebook?.accessToken) return [];

         const pagesResponse = await fetch(`https://graph.facebook.com/${META_API_VERSION}/me/accounts?access_token=${user.social_credentials.facebook.accessToken}`);
        const pagesData = await pagesResponse.json();

        const selectedPagesDetails = (pagesData.data || []).filter((page: any) => selectedPages.includes(page.id));

        for (const selectedPage of selectedPagesDetails) {
          const pageAccessToken = selectedPage.access_token;
          const pageId = selectedPage.id;

            const pageInfoResponse = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${pageId}?fields=name,picture&access_token=${pageAccessToken}`);
            const pageInfo = await pageInfoResponse.json();
           let allPosts = [];
          let nextUrl = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/posts?fields=id,message,created_time,permalink_url,attachments{subattachments,media,type,url},story&access_token=${pageAccessToken}`;

          while (nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            console.log(data,'data')
            allPosts.push(...(data?.data || []));
            nextUrl = data?.paging?.next || null;
          }

           contents = allPosts.map(post => ({
            id: post.id,
            caption: post.message || post.story || '',
            media_type: post.attachments?.data[0]?.type == "photo"? "IMAGE":"VIDEO", 
            media_url: post.attachments?.data[0]?.media?.image?.src || post.attachments?.data[0]?.media?.source || '',
            permalink: post.permalink_url,
            timestamp: post.created_time,
            platform: 'facebook',
            pageId,
            profileName: pageInfo.name,
            profilePicture: pageInfo.picture?.data?.url || null

          }));

          medias.push(...contents);
        }
      }
    }

    return medias;
  } catch (error: any) {
    console.error('Error fetching inbox:', error);
    throw new CustomError('Error while fetching chats', 500);
  }
}




async getContentDetails(
  orgId: string,
  entity: string,
  userId: string,
  platform: string,
  mediaId: string,
  mediaType: string,
  pageId:string
): Promise<any> {
  try {
    const user = entity === 'agency'
      ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
      : await this._clientTenantRepository.getClientById(orgId, userId);

    if (!user) {
      throw new Error('User not found');
    }

    let contentDetails: any = {};

    if (platform === "instagram") {
      const accessToken = user.social_credentials.instagram?.accessToken;
      if (!accessToken) throw new Error('Instagram access token missing');
      const pages = await getPages(accessToken)
      const page = pages.data.find((p)=> p.id == pageId)

      const commentsRes = await fetch(
        `https://graph.facebook.com/${mediaId}/comments?fields=id,text,username,timestamp&access_token=${page.access_token}`
      );
      const commentsData = await commentsRes.json();
      console.log(commentsData,"commentdata")
      if (commentsData.error) throw new Error(`Instagram comments error: ${JSON.stringify(commentsData.error)}`);

      const mediaRes = await fetch(
        `https://graph.facebook.com/${mediaId}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,children&access_token=${page.access_token}`
      );
      const mediaData = await mediaRes.json();
      console.log(mediaData,"mediaData")

      if (mediaData.error) throw new Error(`Instagram media error: ${JSON.stringify(mediaData.error)}`);

      const getSupportedMetrics = (type: string) => {
        switch(type.toUpperCase()){
          case 'VIDEO': return ['reach','likes','comments'];
          case 'IMAGE': return ['reach','saved','likes','comments'];
          case 'REELS': return ['views','likes','comments','saved'];
          case 'STORY': return ['replies','exits','taps_forward','taps_back'];
          default:      return ['reach','likes','comments'];
        }
      };
      const metrics = getSupportedMetrics(mediaData.media_type || mediaType);

      const insightsRes = await fetch(
        `https://graph.facebook.com/${mediaId}/insights?metric=${metrics.join(',')}&access_token=${page.access_token}`
      );
      const insightsData = await insightsRes.json();
      console.log(insightsData,"insightsDatasss")

      if (insightsData.error) throw new Error(`Instagram insights error: ${JSON.stringify(insightsData.error)}`);

      contentDetails = {
        media: {
          id: mediaData.id,
          caption: mediaData.caption,
          media_type: mediaData.media_type,
          media_url: mediaData.media_url,
          thumbnail_url: mediaData.thumbnail_url,
          permalink: mediaData.permalink,
          timestamp: mediaData.timestamp,
          username: mediaData.username,
          platform:"instagram",
          pageId
        },
        comments: commentsData.data || [],
        insights: insightsData.data || []
      };

    } else if (platform === "facebook") {
       const accessToken = user.social_credentials.facebook?.accessToken;
      if (!accessToken) throw new Error('Facebook access token missing');
      const pages = await getPages(accessToken)
      const page = pages.data.find((p)=> p.id == pageId)

      const commentsRes = await fetch(
        `https://graph.facebook.com/${mediaId}/comments?fields=id,message,from,created_time,like_count,comment_count&access_token=${page.access_token}`
      );
      const commentsData = await commentsRes.json();
      console.log(commentsData,"comments")
      if (commentsData.error) throw new Error(`Facebook comments error: ${JSON.stringify(commentsData.error)}`);

      const postDetailsRes = await fetch(
        `https://graph.facebook.com/${META_API_VERSION}/${mediaId}?fields=id,message,created_time,permalink_url,attachments{subattachments,media_type,url,media{image,source}},story&access_token=${page.access_token}`
      );
      const postData = await postDetailsRes.json();
      console.log(postData, "postData for details");

      if (postData.error) throw new Error(`Facebook post details error: ${JSON.stringify(postData.error)}`);

      let media_type = 'UNKNOWN';
      let media_url = '';

      if (postData.attachments && postData.attachments.data && postData.attachments.data.length > 0) {
        const firstAttachment = postData.attachments.data[0];

        media_type = firstAttachment.media_type || 'UNKNOWN';  
        if (media_type === 'video' && firstAttachment.media && firstAttachment.media.source) {
            media_url = firstAttachment.media.source;  
        } else if (firstAttachment.media && firstAttachment.media.image && firstAttachment.media.image.src) {
            media_url = firstAttachment.media.image.src;  
        } else if (firstAttachment.url) {
            media_url = firstAttachment.url;  
        }

        if (firstAttachment.subattachments && firstAttachment.subattachments.data && firstAttachment.subattachments.data.length > 0) {
            const firstSubAttachment = firstAttachment.subattachments.data[0];
            if (firstSubAttachment.media && firstSubAttachment.media.image && firstSubAttachment.media.image.src) {
                media_url = firstSubAttachment.media.image.src;
                media_type = firstSubAttachment.media_type || media_type;
            } else if (firstSubAttachment.media && firstSubAttachment.media.source) {
                media_url = firstSubAttachment.media.source;
                media_type = firstSubAttachment.media_type || media_type;
            } else if (firstSubAttachment.url) {
                media_url = firstSubAttachment.url;
                media_type = firstSubAttachment.media_type || media_type;
            }
        }
      }


const insightsRes = await fetch(
  `https://graph.facebook.com/${mediaId}/insights?metric=post_impressions_organic&access_token=${page.access_token}`
);
      const insightsData = await insightsRes.json();
      console.log(insightsData,"insigit dataaaaa")
      if (insightsData.error) throw new Error(`Facebook insights error: ${JSON.stringify(insightsData.error)}`);

      contentDetails = {
        media: {
          id: postData.id,
          caption: postData.message || postData.story || '',
          media_type: ["video","reel"].includes(media_type) ? "VIDEO":"IMAGE",
          media_url: media_url,   
          permalink: postData.permalink_url,
          timestamp: postData.created_time,
          thumbnail_url: media_url,
          platform: "facebook",
          pageId: page.id,
          pageName:page.name,
          username:page.name,
        },
        comments: commentsData.data || [],
        insights: insightsData.data || []
      };
    }

    return contentDetails;
  } catch (error: any) {
    console.error('Error fetching content details:', error);
    throw new CustomError('Error while fetching content details', 500);
  }
}


async replayToComments(
  orgId: string,
  entity: string,
  userId: string,
  platform: string,
  commentId: string,
  pageId:string,
  replyMessage: string
): Promise<any> {
  try {
    const user = entity === 'agency'
      ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
      : await this._clientTenantRepository.getClientById(orgId, userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!replyMessage || replyMessage.trim() === '') {
      throw new Error('Reply message cannot be empty');
    }

    if (platform === "instagram") {
      const instagramAccessToken = user.social_credentials.instagram?.accessToken;
      if (!instagramAccessToken) {
        throw new Error('Instagram access token missing');
      }

      const pages = await getPages(instagramAccessToken)
      const page = pages.data.find((p)=> p.id == pageId)

      const response = await fetch(`https://graph.facebook.com/v19.0/${commentId}/replies?message=${replyMessage}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    access_token: page.access_token,
  }),
});

      const data = await response.json();

      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message}`);
      }

      return data;  

    } else if (platform === "facebook") {
      const facebookAccessToken = user.social_credentials.facebook?.accessToken;
      if (!facebookAccessToken) {
        throw new Error('Facebook access token missing');
      }

      const pages = await getPages(facebookAccessToken)
      const page = pages.data.find((p)=> p.id == pageId)


     const response = await fetch(`https://graph.facebook.com/${commentId}/comments?message=${encodeURIComponent(replyMessage)}&access_token=${page.access_token}`, {
        method: 'POST',
      });


      const data = await response.json();

      if (data.error) {
        throw new Error(`Facebook API error: ${data.error.message}`);
      }

      return data; // returns the newly created comment ID

    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

  } catch (error: any) {
    console.error('Error replying to comment:', error);
    throw new CustomError('Error while replying to comment', 500);
  }
}



}





