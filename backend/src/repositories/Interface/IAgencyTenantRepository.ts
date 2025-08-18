import { IAgencyTenant } from "../../types/agency"
import { IIntegratePaymentType, IUpdateProfile } from "../../types/common"

export interface IAgencyTenantRepository {
    setSocialMediaTokens(orgId: string, provider: string, accesstoken: string, refreshtoken?: string): Promise<void>
    getOwners(orgId: string): Promise<IAgencyTenant[] | null>
    saveDetails(new_agency: object,orgId: string): Promise<IAgencyTenant>
    updateProfile(orgId: string,details:IUpdateProfile):Promise<IAgencyTenant | null>
    upgradePlan(orgId: string,planId:string):Promise<IAgencyTenant | null>
    integratePaymentGateWay(orgId:string,provider:string,details:IIntegratePaymentType):Promise<IAgencyTenant | null>
    getOwnerWithOrgId(orgId:string):Promise<IAgencyTenant | null>
}