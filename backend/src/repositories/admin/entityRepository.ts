import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agencyModel";
import Company from "../../models/company/companyModel";

class EntityRepository{
    async createAgency(newAgency: any): Promise<any> {
        const { orgId, organizationName, name, email, address, websiteUrl,
            industry, password, contactNumber,planId,validity, logo ,planPurchasedRate} = newAgency
        try {
            const agency = new Agency({
                orgId, organizationName,
                name, email, address,
                websiteUrl, industry, password,
                contactNumber, logo,planId,validity,
                planPurchasedRate
            })
            const newAgency =  await agency.save()
            return newAgency
        } catch (error) {
            console.error('Error creating agency', error)
            return null
        }
    }



    async createCompany(newCompany:any):Promise<any>{
        const {orgId,organizationName,name,email,address, websiteUrl,
            industry, contactNumber, logo,password} = newCompany
            const company = new Company({
                orgId,organizationName,name,email,address, websiteUrl,
                industry, contactNumber, logo ,password
            })
            const companyDetails = await company.save()
            return companyDetails
    }


    async isAgencyMailExists(email:string):Promise<any>{
        try {
            return await Agency.findOne({email:email}) 
        } catch (error) {
            console.log(error);
            return null
            
        }
    }


    async isCompanyMailExists(email:string):Promise<any>{
        try {
            return await Company.findOne({email:email}) 
        } catch (error) {
            console.log(error);
            return null
            
        }
    }

    async saveDetailsInAgencyDb(id:string,orgId:string):Promise<any>{
        try {
            const db = await connectTenantDB(orgId)
            const AgencyModel = db.model('OwnerDetail',ownerDetailsSchema)
            const agency = new AgencyModel({
                ownerId:id,
                orgId:orgId
            })
            await agency.save()
        } catch (error) {
            // next(error)
        }
    }



}

export default EntityRepository;
