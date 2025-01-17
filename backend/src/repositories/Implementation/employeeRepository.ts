import Employee, { IEmployee } from '../../models/employee/employeeModel'
import { IEmployeeRepository } from '../Interface/IEmployeeRepository';




export default class EmployeeRepository implements IEmployeeRepository {

    async findEmployeeWithMail(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email: email });
    }

    async findEmployeeWithId(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email: email });
    }

}
