import { IAgency } from "@/models/Interface/agency";


export class AgencyMapper {
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
}
