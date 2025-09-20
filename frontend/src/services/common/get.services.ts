import api from "@/utils/axios";

export const getOwnerId = () => {
  return api.get("/api/public/owner");
};

export const getAllProjects = (
  role: string,
  userId: string,
  query: string = ""
) => {
  return api.get(`/api/project/projects?role=${role}&userId=${userId}&${query}`);
};


export const getConnectSocailMediaUrlApi = async (endpoint: string) => {
  console.log(endpoint, "endpoints");
  return await api.get(endpoint);
};

export const getContentsApi = async ( role: string, userId: string, query: string = "" ) => {
  return await api.get(`/api/provider/contents/${role}/${userId}/${query}`);
};


export const fetchAllChatsApi = async (userId: string) => {
  return await api.get(`/api/chat/get-chats/${userId}`);
};

export const getMetaPages = async (role: string, userId: string) => {
  return await api.get(`/api/provider/get-meta-pages/${role}/${userId}`);
};

export const fetchAllSchduledContentsApi = async (userId: string) => {
  return await api.get(`/api/provider/content/scheduled/${userId}`);
};

export const fetchConnections = async (entity: string, user_id: string, query = "") => {
  return await api.get(`/api/provider/get-connections/${entity}/${user_id}${query}`);
};

export const getInvoices = async (
  entity: string,
  user_id: string,
  query = ""
) => {
  return await api.get(`/api/entities/invoices/${entity}/${user_id}${query}`);
};

export const getAllTransactions = async (
  entity: string,
  user_id: string,
  query = ""
) => {
  return await api.get(`/api/entities/payments/${entity}/${user_id}${query}`);
};

export const getPlanDetailsApi = async (planId: string) => {
  return await api.get(`/api/public/plans/${planId}`);
};

export const getAllPortalPlans = async() =>{
    return await api.get(`/api/public/plans?page=0&limit=0&sortOrder=asc`)
}

export const getActivitesApi = async (role: string, user_id: string) => {
  return await api.get(`/api/entities/activity/${role}/${user_id}`);
};

export const getInboxMessagesApi = async (
  user_id: string,
  platform: string,
  conversationId: string
) => {
  console.log(user_id, "dsaf");
  return await api.get(
    `/api/inbox/inboxMessages/${platform}/${user_id}/${conversationId}`
  );
};

export const getAllPortfoliosApi = async (query: string) => {
  return await api.get(`/api/showcase/portfolio${query}`);
};

export const getAllTestimoinalsApi = async () => {
  return await api.get(`/api/showcase/testimonials`);
};


export const getAnalyticsByAdSetId = async(
  role: string,
  user_id: string,
  platform: string,
  adsetId: string
) => {
    const queryString = new URLSearchParams({adsetId,platform}).toString();

  return await api.get(
    `/api/lead/ads/analytics/${role}/${user_id}?${queryString}`
  );
};


export const getAllCalenderEventsApi = async(role: string,userId:string) =>{
  return await api.get(`/api/entities/calender/${role}/${userId}`)
}