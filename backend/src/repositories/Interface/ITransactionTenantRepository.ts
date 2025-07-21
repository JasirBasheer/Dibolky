import { ITransaction } from "@/models";

export interface ITransactionTenantRepository {
    createTransaction(orgId:string,transaction: object): Promise<ITransaction | null>;
    getTransactionsWithOrgId(orgId: string): Promise<Partial<ITransaction[]> | null>
    getAllTransactions( orgId: string, filter: Record<string, unknown> , options?: { page?: number, limit?: number, sort?: any }): Promise<{ transactions: ITransaction[], totalCount: number ,totalPages: number }>
}