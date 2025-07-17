import { IClient } from "@/models/Interface/client";
import { IClientType } from "@/types/client";

export class ClientMapper {
  static ClientDetailsMapper(details: IClient) {
    return {
      _id: details._id,
      role: details?.role,
      orgId: details?.orgId,
      organizationName: details?.organizationName,
      name: details.name,
      email: details.email,
      industry: details.industry,
      isBlocked: details?.isBlocked,
    } as Partial<IClientType>
  }
}
