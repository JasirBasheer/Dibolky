import { IAgencyTenant } from "../../shared/types/agency.types"
import { IUpdateProfile } from "../../shared/types/common.types"

export interface IAgencyTenantRepository {
    setSocialMediaTokens(orgId: string, provider: string, token: string): Promise<void>
    getOwners(orgId: string): Promise<IAgencyTenant[] | null>
    updateProfile(orgId: string,details:IUpdateProfile):Promise<IAgencyTenant | null>
}