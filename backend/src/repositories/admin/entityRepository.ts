import { connectTenantDB } from "../../config/db";
import Agency from "../../models/agency/agencyOwnerModel";
import Company from "../../models/company/companyOwnerModel";
import {agencySchema} from "../../models/agency/agencyModel";
import {companySchema} from "../../models/company/companyModel";

class EntityRepository{
    async createAgency(newAgency: any): Promise<any> {
        const { orgId, agencyName, ownerName, email, address, websiteUrl,
            industry, password, contactNumber, platformEmail, logo } = newAgency
        try {
            const agency = new Agency({
                orgId, agencyName,
                ownerName, email,
                platformEmail, address,
                websiteUrl, industry, password,
                contactNumber, logo
            })
            await agency.save()
            return agency.platformEmail
        } catch (error) {
            console.error('Error creating agency', error)
            return null
        }
    }



    async createAgencyDb(newAgencyDb: any): Promise<any> {
        try {
            const { orgId, agencyName, ownerName, email, address, websiteUrl,
                industry, contactNumber, platformEmail, logo } = newAgencyDb

            const AgencyDbConnection =await connectTenantDB(newAgencyDb.orgId)

            const AgencyModel = AgencyDbConnection.model('owner', agencySchema);

            const agencyData = new AgencyModel({
                orgId, agencyName,
                ownerName, email,
                platformEmail, address,
                websiteUrl, industry,
                contactNumber, logo
            });
    
            const savedData = await agencyData.save();
            return savedData;

        } catch (error) {
            console.error(error)
        }
    }


    async createCompany(newCompany:any):Promise<any>{
        const {orgId,companyName,ownerName,email,address, websiteUrl,
            industry, contactNumber, platformEmail, logo,password} = newCompany
            const company = new Company({
                orgId,companyName,ownerName,email,address, websiteUrl,
                industry, contactNumber, platformEmail, logo ,password
            })
            const companyDetails = await company.save()
            return companyDetails
    }

    async createCompanyDb(newCompanyDb: any): Promise<any> {

        try {
            const { orgId, companyName, ownerName, email, address, websiteUrl,
                industry, contactNumber, platformEmail, logo ,password} = newCompanyDb

            const companyDbConnection =await connectTenantDB(newCompanyDb.orgId)

            const CompanyModel = companyDbConnection.model('owner', companySchema);

            const companyData = new CompanyModel({
                orgId, companyName,
                ownerName, email,
                platformEmail, address,
                websiteUrl, industry,
                contactNumber, logo,password
            });
    
            const savedData = await companyData.save();
            return savedData;

        } catch (error) {
            console.error(error)
        }
    }

}

export default EntityRepository;
