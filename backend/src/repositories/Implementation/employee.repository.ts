import Employee from '../../models/employee/employee.model'
import { IEmployee } from '../../shared/types/employee.types';
import { IEmployeeRepository } from '../Interface/IEmployeeRepository';




export default class EmployeeRepository implements IEmployeeRepository {

    async findEmployeeWithMail(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email: email });
    }

    async findEmployeeWithId(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email: email });
    }

}
