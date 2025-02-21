import { ITransaction } from "../../models/admin/transaction.model";

export interface ITransactionRepository {
    createTransaction(transaction: Partial<ITransaction>): Promise<ITransaction | null>;
    getTransactionsWithOrgId(orgId: string): Promise<Partial<ITransaction[]> | null>
}