import AgencyEntityRepository from "../../repositories/agency/entityRepository";
import { sendMail } from "../../utils/nodeMailer";
import {  createPassword, hashPassword } from "../../utils/passwordUtils";


class AgencyEntityService {
    private agencyEntityRepository: AgencyEntityRepository;

    constructor() {
        this.agencyEntityRepository = new AgencyEntityRepository()
    }

    async createDepartment(department: string, permissions: string[]): Promise<any> {
        try {
            // need to check if the d already exists --later
            const newDepartment = {
                department,
                permissions
            }
            const createdDepartment = this.agencyEntityRepository.createDepartment(newDepartment)
            if (!createdDepartment) {
                return null
            }
            return createdDepartment

        } catch (error) {
            console.error(error)
            return null
        }

    }

    async createEmployee(orgId: string, employeeName: string, department: string, email: string, password: string) {
        try {
            let hashedPassword = await hashPassword(password)
            const newEmployee = {
                orgId,
                employeeName,
                department,
                email,
                password: hashedPassword
            }
            const createdEmployee = await this.agencyEntityRepository.createEmployee(newEmployee)
            if (createdEmployee) await this.agencyEntityRepository.createEmployeeMainDB(newEmployee)
            return createdEmployee
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async createClient(orgId: string, name: string, email: string, socialMedia_credentials: any): Promise<any> {
        try {
            //check the client already exists in the db with the same email --later
            const isAgencyExists = await this.agencyEntityRepository.findAgency(orgId)
            console.log(isAgencyExists)

            if(!isAgencyExists){
                return null
            }
            let password = await createPassword(name)
            const HashedPassword = await hashPassword(password)
            const newClient = {
                orgId, name, email,
                socialMedia_credentials,
                password: HashedPassword
            }

            const createdClient = await this.agencyEntityRepository.createClient(newClient)
            if (createdClient) await this.agencyEntityRepository.saveClientToMainDB(newClient)
                sendMail(email,name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),password)
            return createdClient
        } catch (error) {
            console.error(error)
            return null
        }
    }

}

export default AgencyEntityService