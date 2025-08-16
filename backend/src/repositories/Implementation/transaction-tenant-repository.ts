import { inject, injectable } from "tsyringe";
import { Model, Schema } from "mongoose";
import { BaseRepository } from "mern.common";
import { connectTenantDB } from "@/config/db.config";
import { ITransactionTenantRepository } from "../Interface";
import { ITransaction } from "@/models";

@injectable()
export class TransactionTenantRepository
  extends BaseRepository<ITransaction>
  implements ITransactionTenantRepository
{
  private _transactionModel: Schema;
  private _modelName = "transaction";
  private _models: Map<string, Model<ITransaction>> = new Map();

  constructor(@inject("transaction_tenant_modal") schema: Schema) {
    super(null as unknown as Model<ITransaction>);
    this._transactionModel = schema;
  }

  private async getModel(orgId: string): Promise<Model<ITransaction>> {
    if (this._models.has(orgId)) {
      return this._models.get(orgId)!;
    }
    const connection = await connectTenantDB(orgId);
    if (!connection) throw new Error("Connection not found");
    let model: Model<ITransaction> = connection.model<ITransaction>(
      this._modelName,
      this._transactionModel
    );
    this._models.set(orgId, model);
    return model;
  }

  async createTransaction(
    orgId: string,
    transaction: object
  ): Promise<ITransaction | null> {
    const model = await this.getModel(orgId);
    return await model.create(transaction);
  }

  async getTransactionsWithOrgId(
    orgId: string
  ): Promise<Partial<ITransaction[]> | null> {
    return await this.find({ orgId: orgId });
  }

  async getAllTransactions(
    orgId: string,
    filter: Record<string, unknown> = {},
    options?: { page?: number; limit?: number; sort?: any }
  ): Promise<{
    transactions: ITransaction[];
    totalCount: number;
    totalPages: number }> {
    const model = await this.getModel(orgId);
    const { page, limit, sort } = options || {};
    const totalCount = await model.countDocuments(filter);

    let query = model.find(filter);
    if (sort) query = query.sort(sort);
    if (page && limit) query = query.skip((page - 1) * limit).limit(limit);
    if (limit > 0) query = query.skip((page - 1) * limit).limit(limit);

    const transactions = await query.exec();
    return {
      transactions,
      totalCount,
      totalPages: limit ? Math.ceil(totalCount / limit) : 1,
    };
  }
}
