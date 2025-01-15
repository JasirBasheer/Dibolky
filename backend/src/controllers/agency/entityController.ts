import { NextFunction, Request, Response } from "express";
import AgencyEntityService from "../../services/agency/entityService"
import { CustomError } from "../../utils/CustomError";


class AgnecyEntityController {
    private agencyEntityService: AgencyEntityService;

    constructor() {
        this.agencyEntityService = new AgencyEntityService();
        this.createDepartment = this.createDepartment.bind(this);
        this.createEmployee = this.createEmployee.bind(this)
        this.createClient = this.createClient.bind(this)
        this.getAgency = this.getAgency.bind(this)
    }


    async getAgency(req:Request,res:Response, next:NextFunction):Promise<any>{
        try {
            console.log(req.details.email ,"Email")
            const details = await this.agencyEntityService.verifyOwner(req.details.email)
            if(!details)throw new CustomError('Account not found',404)
            return res.status(200).json({success:true,details,role:"Agency"})
        } catch (error:any) {
          next(error)
        }
    }


    async createDepartment(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { department, permissions } = req.body
            // need to validate data --later
            const newDepartment = await this.agencyEntityService.createDepartment(department, permissions)
            if (newDepartment) {
                return res.status(201).json({ success: true })
            }
            return res.status(401).json({ success: false })
        } catch (error) {
            next(error)
        }

    }

    async createEmployee(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { orgId, employeeName, department, email, password } = req.body
            //validate the employee datas --later
            const createdEmployee = await this.agencyEntityService.createEmployee(orgId, employeeName, department, email, password)
            if (!createdEmployee) {
                return res.status(401).json({ success: false })
            }
            return res.status(201).json({ success: true })

        } catch (error) {
            next(error)
        }
    }

    async createClient(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { orgId, name, email,industry, socialMedia_credentials } = req.body
            console.log(req.body);
            
            //validate the client datas --later
            await this.agencyEntityService.createClient(req.clientModel ,orgId, name, email,industry, socialMedia_credentials)
            return res.status(201).json({ success: true })
        } catch (error:any) {
            next(error)
        }
    }



   
}

export default new AgnecyEntityController()