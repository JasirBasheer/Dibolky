import { IAdmin } from "@/models/Interface/admin";
import { IAgency } from "@/models/Interface/agency";
import { IClient } from "@/models/Interface/client";
import { IAdminType } from "@/types/admin";
import { IAgencyType } from "@/types/agency";
import { IClientType } from "@/types/client";

type Role = 'agency' | 'admin' | 'client';
type UserInput = IAdmin | IAgency | IClient;
type UserOutput = IAdminType | IAgencyType | IClientType;

export class UserMapper {
  static getMappedDetails(role: Role, details: UserInput): UserOutput {
    const base = {
      _id: details._id?.toString() ?? '',
      name: details.name,
      email: details.email,
    };

    if (role === 'agency') {
      const agency = details as IAgency;
      return {
        ...base,
        planId: agency.planId,
      } as IAgencyType;
    }

    return base satisfies IAdminType | IClientType;
  }
}
