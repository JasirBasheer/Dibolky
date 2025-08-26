import { QueryDto } from "@/dtos";
import { PaginatedResponse } from "@/dtos/outbound/common";
import { Transaction } from "@/models";

export interface ITransactionService {
  getTransactions(
    query: QueryDto
  ): Promise<PaginatedResponse<Transaction>>;
}
