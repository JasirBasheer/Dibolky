import { IEmployee } from "../../models/employee/employeeModel";

export interface IEmployeeService {
    employeeLoginHandler(email: string, password: string): Promise<IEmployee | null>;
}