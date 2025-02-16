import { IEmployeeController } from '../Interface/IEmployeeController';
import { inject, injectable } from 'tsyringe';
import { IEmployeeService } from '../../services/Interface/IEmployeeService';
import { Request, Response, NextFunction } from 'express';

@injectable()
export default class EmployeeController implements IEmployeeController {
    private employeeService: IEmployeeService;

    constructor(
        @inject('EmployeeService') employeeService: IEmployeeService
    ) {
        this.employeeService = employeeService
    }

    async getEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

        } catch (error) {
            next(error)
        }

    }

}



