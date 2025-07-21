import { inject, injectable } from 'tsyringe';
import { ITransactionRepository } from '../Interface/ITransactionRepository';
import { Model } from 'mongoose';
import { BaseRepository } from 'mern.common';
import { ITransaction } from '@/models';

@injectable()
export class TransactionRepository extends BaseRepository<ITransaction> implements ITransactionRepository {
    constructor(
        @inject('transaction_model') model: Model<ITransaction>
    ) {
        super(model);
    }


    async createTransaction(
        transaction: object
    ): Promise<ITransaction | null> {
        return await this.create(transaction)
    }


    async getTransactionsWithOrgId(
        orgId: string
    ): Promise<Partial<ITransaction[]> | null> {
        return await this.find({ orgId: orgId })
    }



}