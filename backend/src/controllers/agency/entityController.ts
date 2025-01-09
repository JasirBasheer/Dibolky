import { Request, Response } from "express";
import AgencyEntityService from "../../services/agency/entityService"


class AgnecyEntityController {
    private agencyentityservice: AgencyEntityService;

    constructor() {
        this.agencyentityservice = new AgencyEntityService();
        this.createDepartment = this.createDepartment.bind(this);
        this.createEmployee = this.createEmployee.bind(this)
        this.createClient = this.createClient.bind(this)
    }

    async createDepartment(req: Request, res: Response): Promise<any> {
        try {
            const { department, permissions } = req.body
            // need to validate data --later
            const newDepartment = await this.agencyentityservice.createDepartment(department, permissions)
            if (newDepartment) {
                return res.status(201).json({ success: true })
            }
            return res.status(401).json({ success: false })
        } catch (error) {
            console.log(error)
        }

    }

    async createEmployee(req: Request, res: Response): Promise<any> {
        try {
            const { orgId, employeeName, department, email, password } = req.body
            //validate the employee datas --later
            const createdEmployee = await this.agencyentityservice.createEmployee(orgId, employeeName, department, email, password)
            if (!createdEmployee) {
                return res.status(401).json({ success: false })
            }
            return res.status(201).json({ success: true })

        } catch (error) {
            console.error(error)
            return null
        }
    }

    async createClient(req: Request, res: Response): Promise<any> {
        try {
            const { orgId, name, email, socialMedia_credentials } = req.body
            //validate the client datas --later
            const createdClient = await this.agencyentityservice.createClient(orgId, name, email, socialMedia_credentials)
            if (!createdClient) return res.status(400).json({ success: false })
            return res.status(201).json({ success: true })
        } catch (error) {
            console.log(error)
        }
    }
}

export default new AgnecyEntityController()