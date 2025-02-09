import { IEmployee } from "../../models/employee/employee.model"

export interface IEmployeeRepository {
    findEmployeeWithMail(email: string): Promise<IEmployee | null>
    findEmployeeWithId(email: string): Promise<IEmployee | null>
  }
  