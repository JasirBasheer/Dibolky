import { ITransaction } from "../../models/transaction";

export interface ITransactionRepository {
    createTransaction(transaction: object): Promise<ITransaction | null>;
    getTransactionsWithOrgId(orgId: string): Promise<Partial<ITransaction[]> | null>
}