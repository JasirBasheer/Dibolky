import { IOwnerDetailsSchema } from "../../shared/types/agency.types"

export interface IAgencyTenantRepository {
    setSocialMediaTokens(orgId: string, provider: string, token: string): Promise<void>
    getOwners(orgId: string): Promise<IOwnerDetailsSchema[] | null>
}