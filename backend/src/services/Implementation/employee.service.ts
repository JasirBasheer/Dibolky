import bcrypt from 'bcrypt'
import { IEmployeeService } from '../Interface/IEmployeeService';
import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '../../repositories/Interface/IEmployeeRepository';
import { NotFoundError, UnauthorizedError } from 'mern.common';

@injectable()
export default class EmployeeService implements IEmployeeService {
    private employeeRepository: IEmployeeRepository;

    constructor(
        @inject('EmployeeRepository') employeeRepository: IEmployeeRepository
    ) {
        this.employeeRepository = employeeRepository
    }

    async employeeLoginHandler(email: string, password: string): Promise<any> {
        const ownerDetails = await this.employeeRepository.findEmployeeWithMail(email);
        if (!ownerDetails) throw new NotFoundError('Account not found');
        if (ownerDetails.isBlocked) throw new UnauthorizedError('Account is blocked');

        const isValid = await bcrypt.compare(password, ownerDetails.password);
        if (!isValid) throw new UnauthorizedError('Invalid credentials');
        return ownerDetails?._id;
    }

}


