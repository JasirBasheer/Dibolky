import { IAgency } from "@/models/Interface/agency";
import { IAgencyType } from "@/types/agency";


export class AdminAgencyMapper {
  static AgencyMapper(agencies: IAgency[]) {
    return agencies.map((agency: IAgency) => {
      return {
            _id: agency._id,
            organizationName: agency.organizationName,
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
    }) as Partial<IAgencyType[]>
  }
}
