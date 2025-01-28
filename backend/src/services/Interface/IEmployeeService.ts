
export interface IEmployeeService {
    employeeLoginHandler(email: string, password: string): Promise<any>;
}