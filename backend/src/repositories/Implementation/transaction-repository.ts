import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../Interface/ITransactionRepository";
import { Model, SortOrder } from "mongoose";
import { BaseRepository } from "mern.common";
import { ITransaction } from "@/models";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository
{
  constructor(@inject("transaction_model") model: Model<ITransaction>) {
    super(model);
  }

  async createTransaction(transaction: object): Promise<ITransaction | null> {
    console.log(transaction,'transaction')
    return await this.create(transaction);
  }

  async getTransactionsWithOrgId(
    orgId: string
  ): Promise<Partial<ITransaction[]> | null> {
    return await this.find({ orgId: orgId });
  }

  async getTransactions(
    filter: Record<string, unknown> = {},
    options?: {
      page?: number;
      limit?: number;
      sort?: string | { [key: string]: SortOrder } | [string, SortOrder][];
    }
  ): Promise<{ data: ITransaction[]; totalCount: number }> {
    const { page, limit, sort } = options || {};
  const totalCount = await this.model.countDocuments(filter);

    let query = this.model.find(filter);

    if (sort) query = query.sort(sort);
    if (page && limit) query = query.skip((page - 1) * limit).limit(limit);

    const data = await query.exec();

    return { data, totalCount };
  }
}
