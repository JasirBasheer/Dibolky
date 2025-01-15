import EntityRepository from '../../repositories/admin/entityRepository';
import PlanRepository from '../../repositories/admin/planRepository';
import AdminRepository from '../../repositories/admin/adminRepository';
import { hashPassword } from '../../utils/passwordUtils';
import { addMonthsToDate } from '../../utils/utils';
import { CustomError } from '../../utils/CustomError';
import bcrypt from 'bcrypt'

class AdminService {
    private entityRepository: EntityRepository;
    private planRepository: PlanRepository;
    private adminRepository: AdminRepository;

    constructor() {
        this.entityRepository = new EntityRepository()
        this.planRepository = new PlanRepository()
        this.adminRepository = new AdminRepository()

    }

    async getAdmin(email:string):Promise<any>{
        try {
            const admin = await this.adminRepository.getAdmin(email)
            if(!admin)throw new CustomError('Admin Not found',404)
            return admin
        } catch (error) {
            throw error
        }
    }

    async getAllPlans(): Promise<any> {
        try {
            let companyPlans = await this.planRepository.getCompanyPlans()
            let agencyPlans = await this.planRepository.getAgencyPlans()
            return {
                Agency: agencyPlans,
                Company: companyPlans
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async IsMailExists(Mail:string,platform:string):Promise<any>{
        try {
            if(platform == "Agency"){
                const isExists =  await this.entityRepository.isAgencyMailExists(Mail)
                if(isExists)return true
                return false

            }else if(platform == "Company"){
                const isExists = await this.entityRepository.isCompanyMailExists(Mail)
                if(isExists)return true
                return false
            }
            return null            
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getPlan(plans:any,id:any,platform:any){
      

        const plan = plans[platform].find((elem: any) => elem._id.toString() === id.toString());
        if(!plan)return null
        return plan           
    }

    async registerAgency(organizationName: string, name: string, email: string, address: any, websiteUrl: string, industry: string, contactNumber: number, logo: string, password: string,planId:string,validity:number,planPurchasedRate:number): Promise<any> {
        try {

            const hashedPassword = await hashPassword(password)
            let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);
            let validityInDate =addMonthsToDate(validity)

            const newAgency = {
                orgId,
                planId,
                validity:validityInDate,
                organizationName,
                name,
                email,
                address,
                websiteUrl,
                industry,
                contactNumber,
                logo,
                password: hashedPassword,
                planPurchasedRate:planPurchasedRate
            };
            console.log(newAgency);
            
            console.log("enteredddddddddddddddddddddddddddddddddddddddddddddddddddd")

            const ownerDetails = await this.entityRepository.createAgency(newAgency);
            console.log(ownerDetails)
            console.log("ownerDetailsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
            await this.entityRepository.saveDetailsInAgencyDb(ownerDetails._id,ownerDetails.orgId)
            return ownerDetails
        } catch (error) {
            console.error('Error creating agency:', error);
            return null

        }
    }


    async registerCompany(organizationName: string, name: string, email: string, address: any, websiteUrl: string, industry: string, contactNumber: number, logo: string, password: string): Promise<any> {
        const hashedPassword = await hashPassword(password)
        let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);

        const newCompany = {
            orgId,
            organizationName,
            name,
            email,
            address,
            websiteUrl,
            industry,
            contactNumber,
            logo,
            password: hashedPassword,
        };

        const createdCompany = await this.entityRepository.createCompany(newCompany)
        return createdCompany

    }

    async getAgencyMenu(planId:string){
        const plan = await this.planRepository.getAgencyPlan(planId)
        return plan.menu
    }   

    async getCompanyMenu(planId:string){
        const plan = await this.planRepository.getCompanyPlan(planId)
        return plan.menu
    }   

    async adminLogin(email:string,password:string){
        try {
            const admin = await this.adminRepository.getAdmin(email)
            if(!admin)throw new CustomError('Admin Not found',404)
            let isValidPassword = await bcrypt.compare(password,admin.password) 
            if(!isValidPassword)throw new CustomError("Invalid credentials",401)
        } catch (error) {
            throw error
        }
    }

    async getRecentClients(){
        try {
           let companies =await this.adminRepository.getAllCompanyOwners()
           let agencies = await this.adminRepository.getAllAgencyOwners()
           let result = {Agency:agencies,Company:companies}
            return result
        } catch (error) {
            throw error
        }
    }

    

    

}


export default AdminService