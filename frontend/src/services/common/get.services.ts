import api from "@/utils/axios";

export const getOwnerId = () => {
  return api.get("/api/entities/owner");
};

export const getAllProjects = (
  role: string,
  userId: string,
  query: string = ""
) => {
  console.log(role, userId, "fdokfjaslkjfsdf");
  return api.get(`/api/entities/projects/${role}/${userId}${query}`);
};

export const getConnectSocailMediaUrlApi = async (endpoint: string) => {
  console.log(endpoint, "endpoints");
  return await api.get(endpoint);
};

export const getContentsApi = async ( role: string, userId: string, query: string = "" ) => {
  return await api.get(`/api/entities/contents/${role}/${userId}/${query}`);
};

export const fetchMessagesApi = async (userId: string) => {
  return await api.get(`/api/entities/get-messages/${userId}`);
};

export const fetchAllChatsApi = async (userId: string) => {
  return await api.get(`/api/entities/get-chats/${userId}`);
};

export const getMetaPages = async (token: string) => {
  return await api.get(`/api/entities/get-meta-pages/${token}`);
};

export const fetchAllSchduledContentsApi = async (userId: string) => {
  return await api.get(`/api/entities/content/scheduled/${userId}`);
};

export const fetchConnections = async (entity: string, user_id: string) => {
  return await api.get(`/api/entities/get-connections/${entity}/${user_id}`);
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
    `/api/entities/inboxMessages/${platform}/${user_id}/${conversationId}`
  );
};

export const getAllPortfoliosApi = async (query: string) => {
  return await api.get(`/api/entities/portfolio${query}`);
};

export const getAllTestimoinalsApi = async () => {
  return await api.get(`/api/entities/testimonials`);
};
