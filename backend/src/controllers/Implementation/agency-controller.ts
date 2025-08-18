import { Request, Response } from "express";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import {
  ConflictError,
  CustomError,
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { QueryParser } from "@/utils";

@injectable()
export class AgencyController implements IAgencyController {
  private _agencyService: IAgencyService;

  constructor(@inject("AgencyService") agencyService: IAgencyService) {
    this._agencyService = agencyService;
  }

  isExists = async (req: Request, res: Response): Promise<void> => {
    const { mail } = req.query as {mail: string};
    const isExists = await this._agencyService.IsMailExists(mail);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      isExists: isExists,
    });
  };

  createTrialAgency = async (req: Request, res: Response): Promise<void> => {
    const createdAgency = await this._agencyService.createAgency({
      ...req.body.details,
      planPurchasedRate: 0,
      transactionId: "trial_user",
      paymentGateway: "trial",
    });
    if (!createdAgency)
      return SendResponse(
        res,
        HTTPStatusCodes.UNAUTHORIZED,
        ResponseMessage.BAD_REQUEST
      );
    SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED);
  };

  createAgency = async (req: Request, res: Response): Promise<void> => {
    const { transaction_id } = req.body;

    const createdAgency = await this._agencyService.createAgency({
      ...req.body.details,
      transactionId: transaction_id,
    });
    if (!createdAgency)
      return SendResponse(
        res,
        HTTPStatusCodes.UNAUTHORIZED,
        ResponseMessage.BAD_REQUEST
      );
    SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED);
  };

  getAgency = async (req: Request, res: Response): Promise<void> => {
    const details = await this._agencyService.verifyOwner(
      req.details._id as string
    );
    if (!details) throw new NotFoundError("Account Not found");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      details,
      role: "agency",
    });
  };

  getAgencyOwnerDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const details = await this._agencyService.getAgencyOwnerDetails(
      req.details.orgId as string
    );
    if (!details) throw new NotFoundError("Account Not found");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details });
  };

  createClient = async (req: Request, res: Response): Promise<void> => {
    const { orgId, name, email, industry, services, menu } = req.body;
    await this._agencyService.createClient(
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

    let result = await this._agencyService.getAllClients(
      req.details.orgId as string,
      includeDetails as string,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { result });
  };

  getClient = async (req: Request, res: Response): Promise<void> => {
    const { client_id } = req.params;
    const details = await this._agencyService.getClient(
      req.details.orgId as string,
      client_id
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details });
  };

  uploadContent = async (req: Request, res: Response): Promise<void> => {
    const { selectedContentType, selectedPlatforms, id, files, caption } =
      req.body;
    if (!files) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const result = await this._agencyService.saveContentToDb(
      id,
      req.details.orgId as string,
      files,
      JSON.parse(selectedPlatforms),
      selectedContentType,
      caption
    );
    if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  getAvailableUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await this._agencyService.getAllAvailableClients(
      req.details.orgId as string
    );
    if (!users) throw new CustomError("Error while fetch available users", 500);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users });
  };

  getProjects = async (req: Request, res: Response): Promise<void> => {
    const { projectsFor } = req.query;
    const projects = await this._agencyService.getProjects(
      req.details.orgId,
      projectsFor as string
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      projects,
    });
  };

  editProjectStatus = async (req: Request, res: Response): Promise<void> => {
    const { projectId, status } = req.body;
    const result = await this._agencyService.editProjectStatus(
      req.details.orgId as string,
      projectId,
      status
    );
    if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  getInitialSetUp = async (req: Request, res: Response): Promise<void> => {
    const initialSetUp = await this._agencyService.getInitialSetUp(
      req.details.orgId as string
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      initialSetUp,
    });
  };

  IntegratePaymentGateWay = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const { details, provider } = req.body;
    const gatewayDetails = await this._agencyService.integratePaymentGateWay(
      req.details.orgId as string,
      provider,
      details
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      details: gatewayDetails,
      provider,
    });
  };

  getPaymentIntegrationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.details) throw new NotFoundError("request details not found");
    const paymentIntegrationStatus =
      await this._agencyService.getPaymentIntegrationStatus(
        req.details.orgId as string
      );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      paymentIntegrationStatus,
    });
  };

  createInvoice = async (req: Request, res: Response): Promise<void> => {
    const { details } = req.body;
    const paymentIntegrationStatus = await this._agencyService.createInvoice(
      req.details.orgId,
      details
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      paymentIntegrationStatus,
    });
  };

  getAllPlans = async (req: Request, res: Response): Promise<void> => {
    const upgradablePlans = await this._agencyService.getUpgradablePlans(
      req.details.orgId
    );
    console.log(upgradablePlans);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
      upgradablePlans,
    });
  };

  upgradePlan = async (req: Request, res: Response): Promise<void> => {
    const { planId } = req.body;
    await this._agencyService.upgradePlan(req.details.orgId, planId);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  handleSendMail = async (req: Request, res: Response): Promise<void> => {
    const { to, message, subject } = req.body;
    await this._agencyService.sendMail(req.details.orgId, to, subject, message);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };
}
