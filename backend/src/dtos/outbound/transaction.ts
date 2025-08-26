import { Transaction, TransactionDoc } from "@/models";

export interface TransactionResponseDto {
  id: string;
  email: string;
  amount: number;
  paymentGateway: string;
  description: string;
  createdAt: Date;
}

export class TransactionMapper {
  static toResponse(transaction: TransactionDoc): Transaction {
    return {
      id: transaction._id.toString(),
      orgId: transaction.orgId,
      planId: transaction.planId,
      email: transaction.email,
      transactionId: transaction.transactionId,
      paymentGateway: transaction.paymentGateway,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      userId: transaction.userId,
      description: transaction.description,
      createdAt: transaction.createdAt,
    };
  }
}
