import { IClientTenant } from "@/models";
import { IAgency } from "@/models/Interface/agency";
import { IClientTenantType } from "@/types/client";


export class AgencyMapper {
  static toAgencyResponse(agency: IAgency) {
      return {
            _id: agency._id.toString(),
            organizationName: agency.organizationName,
            orgId: agency.orgId,
            name: agency.name,
            email: agency.email,
            address: agency.address,
            profile:agency?.profile,
            bio:agency?.profile,
            websiteUrl: agency.websiteUrl,
            industry: agency.industry,
            contactNumber: agency.contactNumber,
            planId: agency.planId,
            validity: agency.validity,
            logo: agency.logo,
            remainingClients: agency.remainingClients,
            isBlocked: agency.isBlocked,
            planPurchasedRate: agency.planPurchasedRate,
            currency:agency.currency,
            createdAt: agency.createdAt
      }
  }
    static AgenyDetailsMapper(details:IAgency) {
    return {
      _id: details._id,
      orgId: details.orgId,
      profile: details.profile,
      bio: details.bio,
      planId: details.planId,
      validity: details.validity,
      organizationName: details.organizationName,
      name: details.name,
      email: details.email,
      industry: details.industry,
      contactNumber: details.contactNumber,
      logo: details.logo
    };
  }
  static TenantClientMapper(clients:IClientTenant[]) {
    return clients.map((client: IClientTenant)=>{
      return {
        _id: client._id?.toString(),
        main_id: client.main_id?.toString(),
        name: client.name,
        email: client.email,
        industry: client.industry,
        profile: client.profile,
        bio: client.bio,
        orgId: client.orgId,
        isPaymentInitialized: client.isPaymentInitialized,
        isSocialMediaInitialized: client.isSocialMediaInitialized,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      }
    }) as IClientTenantType[]
  }

}
