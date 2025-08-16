import { ITransaction } from "@/models";
import { SortOrder } from "mongoose";

export interface ITransactionRepository {
    createTransaction(transaction: object): Promise<ITransaction | null>;
    getTransactionsWithOrgId(orgId: string): Promise<Partial<ITransaction[]> | null>
    getTransactions(filter?: Record<string, unknown> , options?: { page?: number, limit?: number, sort?: string | { [key: string]: SortOrder } | [string, SortOrder][] }): Promise<{data:ITransaction[] , totalCount: number}>
    }