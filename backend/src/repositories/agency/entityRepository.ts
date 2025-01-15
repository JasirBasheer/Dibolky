import { connectTenantDB } from '../../config/db'
import Client, { clientSchema } from '../../models/agency/clientModel'
import { departmentSchema } from '../../models/agency/departmentModel'
import Employee from '../../models/agency/employeeModel'
import { MainDbEmployeeSchema } from '../../models/agency/employeeModel'
import Agency from "../../models/agency/agencyModel";


class AgencyEntityRepository {
    async findEmployee(email: string) {
        return Employee.findOne({ email })
    }

   async findAgencyOwner(email: string): Promise<any> {
        try {
            return await Agency.findOne({ email:email });
        } catch (error) {
            throw error;
        }
    }

    async createEmployee(details: any): Promise<any> {
        try {
            const { orgId, employeeName, department, email, password } = details
            const DB = await connectTenantDB(orgId)
            const EmployeeModel = DB.model('Employee', MainDbEmployeeSchema)
            const employee = new EmployeeModel({
                orgId,
                employeeName,
                department,
                email, password
            })
            const createdEmployee = await employee.save()
            return createdEmployee
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async createEmployeeMainDB(details: any): Promise<any> {
        try {
            const { orgId, employeeName, department, email, password } = details
            const employee = new Employee({
                orgId,
                employeeName, department,
                email, password
            })
            const createdEmployee = await employee.save()
            return createdEmployee
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async createDepartment(details: any): Promise<any> {
        try {
            const { department, permissions } = details
            const DB = await connectTenantDB('vicigrow333986')
            const departmentModel = DB.model('department', departmentSchema)
            const newDepartment = new departmentModel({
                department,
                permissions
            })
            const createdDepartment = await newDepartment.save()
            return createdDepartment
        } catch (error) {
            console.error(error)
        }
    }

    async findAgency(orgId: string): Promise<any> {
        try {
            return await Agency.findOne({ orgId: orgId })
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async isClientExists(email:string):Promise<any>{
        try {
            const client = await Client.findOne({email:email}) 
            return client
        } catch (error) {
            return null
            
        }
    }

    async createClient(clientModel:any,details: any): Promise<any> {
        try {
            const { orgId, name, email, socialMedia_credentials, password } = details
            const newClient = new clientModel({
                orgId,
                name, email,
                socialMedia_credentials,
                password
            })

            const createdClient = await newClient.save()
            return createdClient

        } catch (error) {
            console.error(error)
            return null
        }
    }

    async saveClientToMainDB(details: any): Promise<any> {
        try {
            const { orgId, name, email, socialMedia_credentials, password } = details
            const newClient = new Client({
                orgId,
                name, email,
                password
            })

            const createdClient = await newClient.save()
            return createdClient

        } catch (error) {
            console.error(error)
            return null
        }
    }


    async changePassword(id: string, password: string) {
        try {
            return await Agency.findOneAndUpdate({ _id: id },{ $set: { password: password } },{ new: true })
        } catch (error) {
            throw error
        }
    }
}

export default AgencyEntityRepository