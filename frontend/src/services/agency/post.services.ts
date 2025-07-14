import { IIntegratePaymentType } from "@/types/common.types";
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

