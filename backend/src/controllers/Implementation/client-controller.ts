import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "../../services/Interface/IClientService";
import {
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { QueryParser } from "@/utils";

@injectable()
export class ClientController implements IClientController {
  private _clientService: IClientService;

  constructor(@inject("ClientService") clientService: IClientService) {
    this._clientService = clientService;
  }

  getClient = async (req: Request, res: Response): Promise<void> => {
    const details = await this._clientService.verifyClient(
      req.details._id as string
    );
    if (!details) throw new NotFoundError("Account Not found");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      details,
      role: "client",
    });
  };

  getClientDetails = async (req: Request, res: Response): Promise<void> => {
    const details = await this._clientService.getClientDetails(
      req.details.orgId as string,
      req.details.email as string
    );
    if (!details) throw new NotFoundError("Account Not found");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      client: details,
    });
  };

  getOwner = async (req: Request, res: Response): Promise<void> => {
    const owners = await this._clientService.getOwners(
      req.details.orgId as string
    );
    if (!owners) throw new NotFoundError("Account Not found");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { owners });
  };

  initiateRazorpayPayment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { invoice_id } = req.params;
    const data = await this._clientService.initiateRazorpayPayment(
      req.details.orgId,
      invoice_id
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { data });
  };

  verifyInvoicePayment = async (req: Request, res: Response): Promise<void> => {
    const { invoiceId, response } = req.body;
    const data = await this._clientService.verifyInvoicePayment(
      req.details.orgId,
      invoiceId,
      response
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { data });
  };

  createClient = async (req: Request, res: Response): Promise<void> => {
    const { orgId, name, email, industry, services, menu } = req.body;
    await this._clientService.createClient(
      orgId,
      name,
      email,
      industry,
      services,
      menu,
      req.details.organizationName as string
    );
    SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED);
  };

  getAllClients = async (req: Request, res: Response): Promise<void> => {
    const includeDetails = req.query.include;
    const query = QueryParser.parseFilterQuery(req.query);

    let result = await this._clientService.getAllClients(
      req.details.orgId as string,
      includeDetails as string,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { result });
  };
}
