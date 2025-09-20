import {
  IContentData,
  IFilesMetaData,
  INote,
  IUpdateProfile,
} from "@/types/common";
import api from "@/utils/axios";

export const savePlatformTokenApi = async (
  platform: string,
  provider: string,
  user_id: string,
  tokens: { accessToken: string; refreshToken?: string }
) => {
  console.log(tokens, "tokens fomrdlfksjlfslkjfksj");
  return await api.post(
    `/api/provider/save-platform-token/${platform}/${provider}/${user_id}`,
    { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken || "" }
  );
};

export const checkIsMailExistsApi = async (query : string = "") => {
  return await api.get(`/api/public/exists${query}`);
};

export const InitiateS3BatchUpload = async (
  filesMetadata: IFilesMetaData[]
) => {
  return await api.post("/api/storage/initiate-batch-upload", {
    files: filesMetadata,
  });
};

export const saveContentApi = async (
  platform: string,
  user_id: string,
  contentData: IContentData
) => {
  return await api.post(
    `/api/provider/content/save/${platform}/${user_id}`,
    contentData
  );
};

export const updateProfileApi = async (
  role: string,
  details: IUpdateProfile
) => {
  console.log(details, role);
  return await api.post(`/api/entities/update-profile`, { role, details });
};

export const getUploadUrlApi = async (fileName: string, fileType: string) => {
  return await api.post(`/api/storage/presign`, { fileName, fileType });
};

export const getSignedUrlApi = async (key: string) => {
  return await api.get(`/api/storage/signed-url?key=${key}`);
};

export const approveContentApi = async (
  content_id: string,
  platform: string,
  user_id: string
) => {
  return await api.post(`/api/provider/approve-content`, {
    content_id,
    platform,
    user_id,
  });
};

export const rescheduleContentApi = async (
  userId: string,
  contentId: string,
  platformId: string,
  date: string
) => {
  return await api.patch(`/api/provider/content/scheduled/${userId}`, {
    contentId,
    platformId,
    date,
  });
};



export const rejectContentApi = async (
  content_id: string,
  reason: Partial<INote>
) => {
  return await api.post(`/api/provider/reject-content`, { content_id, reason });
};

export const fetchChatsApi = async (chatId: string) => {
  return await api.post(`/api/chat/chats`, { chatId });
};

export const handleLinkedinAndXCallbackApi = async (
  code: string,
  provider: string,
  state?: string
) => {
  console.log("calling api");
  return await api.post(`/api/provider/${provider}/callback`, { code, state });
};

export const getInboxConversations = async (
  role: string,
  user_id: string,
  selectedPlatforms: string[],
  selectedPages: string[]
) => {
  console.log(user_id, "dsaf");
  return await api.post(`/api/inbox/inbox/${role}/${user_id}`, {
    selectedPages,
    selectedPlatforms,
  });
};

export const getMediaApi = async (
  role: string,
  user_id: string,
  selectedPlatforms: string[],
  selectedPages: string[]
) => {
  return await api.post(`/api/provider/media/${role}/${user_id}`, {
    selectedPages,
    selectedPlatforms,
  });
};

export const getMediaDetailsApi = async (
  role: string,
  user_id: string,
  media: { platform: string; id: string; type: string; pageId: string }
) => {
  return await api.get(
    `/api/provider/media/${role}/${user_id}/${media.platform}/${media.pageId}/${media.id}/${media.type}`
  );
};


export const getCampaignsApi = async (
  role: string,
  userId: string,
  selectedPlatforms: string[],
  selectedAdAccounts: string[]
) => {
  const params = new URLSearchParams();

  selectedPlatforms.forEach(p => params.append('selectedPlatforms', p));
  selectedAdAccounts.forEach(a => params.append('selectedAdAccounts', a));

  return await api.get(`/api/lead/campaigns/${role}/${userId}?${params.toString()}`);
};


export const getAdSetsApi = async (
  role: string,
  user_id: string,
  campaignDetails: { id: string; name: string; type: string; pageId: string }
) => {
    const queryString = new URLSearchParams(campaignDetails).toString();

  return await api.get(
    `/api/lead/adsets/${role}/${user_id}?${queryString}`
  );
};

export const fetchAdsApi = async(
  role: string,
  user_id: string,
  platform: string,
  adsetId: string
) => {
    const queryString = new URLSearchParams({adsetId,platform}).toString();

  return await api.get(
    `/api/lead/ads/${role}/${user_id}?${queryString}`
  );
};



export const replayCommentApi = async (
  entity: string,
  user_id: string,
  platform: string,
  commentId: string,
  replyMessage: string,
  pageId: string
) => {
  return await api.post(`/api/provider/media/comment`, {
    entity,
    user_id,
    platform,
    commentId,
    replyMessage,
    pageId,
  });
};

export const hideCommentApi = async (
  platform: string,
  commentId: string,
  userId: string,
  entity: string,
  pageId: string
) => {
  return await api.patch(`/api/provider/media/comment`, {
    platform,
    commentId,
    userId,
    entity,
    pageId,
  });
};

export const deleteCommentApi = async (
  platform: string,
  commentId: string,
  userId: string,
  entity: string,
  pageId: string
) => {
  return await api.delete(`/api/provider/media/comment`, {
    data: { platform, commentId, userId, entity, pageId },
  });
};

export const createCampaignApi = async (
  role: string,
  userId: string,
  campaignData: {
    name: string;
    objective: string;
    adAccountId: string;
    platform?: string;
    status?: string;
    daily_budget?: number;
    lifetime_budget?: number;
    start_time?: string;
    stop_time?: string;
    special_ad_categories?: string[];
  }
) => {
  // Set default values if not provided
  const dataWithDefaults = {
    ...campaignData,
    platform: campaignData.platform || "meta_ads",
    status: campaignData.status || "PAUSED"
  };
  
  return await api.post(`/api/lead/campaigns/${role}/${userId}`, dataWithDefaults);
};

export const deleteCampaignApi = async (
  role: string,
  userId: string,
  campaignId: string,
  platform: string
) => {
  return await api.delete(`/api/lead/campaigns/${role}/${userId}`, {
    data: { campaignId, platform }
  });
};

export const toggleCampaignStatusApi = async (
  role: string,
  userId: string,
  campaignId: string,
  platform: string,
  currentStatus: string
) => {
  return await api.patch(`/api/lead/campaigns/${role}/${userId}`, {
    campaignId,
    platform,
    currentStatus
  });
};
