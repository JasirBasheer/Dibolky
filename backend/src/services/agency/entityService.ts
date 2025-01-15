import AgencyEntityRepository from "../../repositories/agency/entityRepository";
import { CustomError } from "../../utils/CustomError";
import { generateResetToken, verifyResetToken } from "../../utils/jwtUtils";
import { createClientMailData, createForgotPasswordData, sendMail } from "../../utils/nodeMailer";
import { createPassword, hashPassword } from "../../utils/passwordUtils";
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'


class AgencyEntityService {
    private agencyEntityRepository: AgencyEntityRepository;

    constructor() {
        this.agencyEntityRepository = new AgencyEntityRepository()
    }

    async agencyLogin(email: string, password: string): Promise<any> {
        const ownerDetails = await this.agencyEntityRepository.findAgencyOwner(email);
        if (!ownerDetails) {
            throw new CustomError('User not found',404);
        }
        if (ownerDetails.isBlocked) {
            throw new CustomError('Account is blocked',403);
        }

        const isValid = await bcrypt.compare(password, ownerDetails.password);
        if (!isValid) {
            throw new CustomError('Invalid credentials',401);
        }


        return ownerDetails;
    }




    async verifyOwner(email: string): Promise<any> {
        console.log(email,"Emial")
        return await this.agencyEntityRepository.findAgencyOwner(email)
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

    async createClient(clientModel:any,orgId: string, name: string, email: string, industry: string, socialMedia_credentials: any): Promise<any> {
        try {
            console.log(orgId,name,email,industry);
            
            //check the client already exists in the db with the same email --later

            const client = await this.agencyEntityRepository.isClientExists(email)
            if (client && client.orgId == orgId) throw new CustomError('Client already exists with this email',409)
            const Agency = await this.agencyEntityRepository.findAgency(orgId)
            if (!Agency) throw new CustomError("Agency not found , Please try again",404)
            if (Agency.remainingClients == 0) throw new CustomError("Client creation limit reached ,Please upgrade for more clients",402)

            let password = await createPassword(name)
            
            const HashedPassword = await hashPassword(password)
            const newClient = {
                orgId, name, email,
                industry, socialMedia_credentials,
                password: HashedPassword
            }

            const createdClient = await this.agencyEntityRepository.createClient(clientModel,newClient)
            if (createdClient) await this.agencyEntityRepository.saveClientToMainDB(newClient)
            const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), password)
            sendMail(email, `Welcome to ${Agency.organizationName}! Excited to Partner with You`, data)
            return createdClient
        } catch (error) {
            throw error
        }
    }

}

export default AgencyEntityService