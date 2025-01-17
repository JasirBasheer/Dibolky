import { IEmployee } from "../../models/employee/employeeModel"

export interface IEmployeeRepository {
    findEmployeeWithMail(email: string): Promise<IEmployee | null>
    findEmployeeWithId(email: string): Promise<IEmployee | null>
  }
  