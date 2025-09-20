import { InvoiceType } from "@/types";
import { IIntegratePaymentType } from "@/types/common";
import api from "@/utils/axios";

export const createClientApi = async(orgId:string,name:string,industry:string,email:string,services:object,menu:string[]) => {
    return await api.post("/api/agency/clients", {
        orgId,
        name,
        industry,
        email,
        services,
        menu
      });
}



export const IntegratePaymentApi = async (
  provider:string,
  details: IIntegratePaymentType
) => {
  return await api.post(`/api/agency/integrate-payment-gateway`, { provider, details })
}

export const createInvoiceApi = async (
  details: Partial<InvoiceType>
) => {
  return await api.post(`/api/agency/invoices`, { details })
}


export const sendMailApi = async (
  to:string[],
  subject:string,
  message:string,

) => {
  return await api.post(`/api/agency/mail`, { to,subject,message })
}



export const createPortfolioApi = async (
    portfolioData: object,
) => {
    return await api.post(`/api/agency/portfolio`, { details:portfolioData })
}




export const handleProjectCompletedApi = (
  projectId: string,
) => {
  return api.patch(`/api/project/projects?projectId=${projectId}`);
};
