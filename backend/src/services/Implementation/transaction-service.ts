import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../../repositories/Interface/ITransactionRepository";
import { ITransactionService } from "../Interface/ITransactionService";
import { PaginatedResponse, QueryDto } from "@/dtos";
import { TransactionMapper } from "@/dtos/outbound/transaction";
import { Transaction } from "@/models";

@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject("TransactionRepository")
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async getTransactions(
    query: QueryDto
  ): Promise<PaginatedResponse<Transaction>> {
    const result = await this._transactionRepository.getTransactions(query);
    return {
      ...result,
      data: result.data.map((tx) => TransactionMapper.toResponse(tx)),
    };
  }
}
