import { PaginatedResponse, QueryDto } from "@/dtos";
import { TransactionDoc } from "@/models";

export interface ITransactionRepository {
    createTransaction(transaction: object): Promise<TransactionDoc | null>;
    getTransactionsWithOrgId(orgId: string): Promise<Partial<TransactionDoc[]> | null>
    getTransactions(query: QueryDto): Promise<PaginatedResponse<TransactionDoc>>
    }