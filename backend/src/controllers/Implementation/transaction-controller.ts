import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { QueryParser } from "@/utils";
import { ITransactionController } from "../Interface";
import { ITransactionService } from "@/services";

@injectable()
export class TransactionController implements ITransactionController {
  private _transactionService: ITransactionService;

  constructor(@inject("TransactionService") transactionService: ITransactionService) {
    this._transactionService = transactionService;
  }

  getTransactions = async (req: Request, res: Response): Promise<void> => {
    const query = QueryParser.parseFilterQuery(req.query);
    const response = await this._transactionService.getTransactions(query);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, response);
  };

}
