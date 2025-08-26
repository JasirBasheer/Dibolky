import { TransactionDoc } from "@/models";

export interface ITransactionTenantRepository {
    createTransaction(orgId:string,transaction: object): Promise<TransactionDoc | null>;
    getTransactionsWithOrgId(orgId: string): Promise<Partial<TransactionDoc[]> | null>
    getAllTransactions( orgId: string, filter: Record<string, unknown> , options?: { page?: number, limit?: number, sort?: any }): Promise<{ transactions: TransactionDoc[], totalCount: number ,totalPages: number }>
}