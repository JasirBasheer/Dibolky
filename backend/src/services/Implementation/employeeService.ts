import { IEmployee } from '../../models/employee/employeeModel';
import { CustomError } from '../../shared/utils/CustomError';
import bcrypt from 'bcrypt'
import { IEmployeeService } from '../Interface/IEmployeeService';
import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '../../repositories/Interface/IEmployeeRepository';

@injectable()
export default class EmployeeService implements IEmployeeService {
    private employeeRepository: IEmployeeRepository;

    constructor(
        @inject('IEmployeeRepository') employeeRepository: IEmployeeRepository
    ) {
        this.employeeRepository = employeeRepository
    }

    async employeeLoginHandler(email: string, password: string): Promise<IEmployee | null> {
        const ownerDetails = await this.employeeRepository.findEmployeeWithMail(email);
        if (!ownerDetails) throw new CustomError('Account not found', 404);
        if (ownerDetails.isBlocked) throw new CustomError('Account is blocked', 403);

        const isValid = await bcrypt.compare(password, ownerDetails.password);
        if (!isValid) throw new CustomError('Invalid credentials', 401);
        return ownerDetails;
    }

}


