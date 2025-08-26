import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../Interface/ITransactionRepository";
import { Model, SortOrder } from "mongoose";
import { BaseRepository } from "mern.common";
import { TransactionDoc } from "@/models";
import { FilterType, QueryParser } from "@/utils";
import { PaginatedResponse, QueryDto } from "@/dtos";

@injectable()
export class TransactionRepository
  extends BaseRepository<TransactionDoc>
  implements ITransactionRepository
{
  constructor(@inject("transaction_model") model: Model<TransactionDoc>) {
    super(model);
  }

  async createTransaction(transaction: object): Promise<TransactionDoc | null> {
    console.log(transaction, "transaction");
    return await this.create(transaction);
  }

  async getTransactionsWithOrgId(
    orgId: string
  ): Promise<Partial<TransactionDoc[]> | null> {
    return await this.find({ orgId: orgId });
  }

  async getTransactions(
    query: QueryDto
  ): Promise<PaginatedResponse<TransactionDoc>> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["email", "paymentGateway", "description"],
    });

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === "desc" ? -1 : 1};
    const totalCount = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

     const mongoQuery = this.model
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const data = await mongoQuery.exec();
    return { data, page, totalCount, totalPages };
  }
}
