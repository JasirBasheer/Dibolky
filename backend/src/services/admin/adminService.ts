import EntityRepository from '../../repositories/admin/entityRepository';
import { hashPassword } from '../../utils/passwordUtils';
class AdminService {
    private entityRepository: EntityRepository;

    constructor() {
        this.entityRepository = new EntityRepository()
    }

    async registerAgency(agencyName: string, ownerName: string, email: string, address: any, websiteUrl: string, industry: string, contactNumber: number, platformEmail: string, logo: string, password: string): Promise<any> {
        try {

            const hashedPassword = await hashPassword(password)
            let orgId = agencyName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);

            const newAgency = {
                orgId,
                agencyName,
                ownerName,
                email,
                address,
                websiteUrl,
                industry,
                contactNumber,
                platformEmail,
                logo,
                password: hashedPassword,
            };


            const ownerEmail = await this.entityRepository.createAgency(newAgency);
            if (ownerEmail) {
                const owner = {
                    orgId,
                    agencyName,
                    ownerName,
                    email,
                    address,
                    websiteUrl,
                    industry,
                    contactNumber,
                    platformEmail,
                    logo,
                }
                await this.entityRepository.createAgencyDb(owner)

            }
            return ownerEmail
        } catch (error) {
            console.error('Error creating agency:', error);
            return null

        }
    }


    async registerCompany(companyName: string, ownerName: string, email: string, address: any, websiteUrl: string, industry: string, contactNumber: number, platformEmail: string, logo: string, password: string): Promise<any> {
        const hashedPassword = await hashPassword(password)
        let orgId = companyName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);

        const newCompany = {
            orgId,
            companyName,
            ownerName,
            email,
            address,
            websiteUrl,
            industry,
            contactNumber,
            platformEmail,
            logo,
            password: hashedPassword,
        };

        const createdCompany = await this.entityRepository.createCompany(newCompany)
        if (createdCompany) {
            await this.entityRepository.createCompanyDb(newCompany)
        }
        return createdCompany

    }

}


export default AdminService