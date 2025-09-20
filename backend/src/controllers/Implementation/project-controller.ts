import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HTTPStatusCodes,
  NotFoundError,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { IProjectService } from "@/services";
import { IProjectController } from "../Interface";
import { QueryParser } from "@/utils";

@injectable()
export class ProjectController implements IProjectController {
  constructor(
    @inject("ProjectService") private readonly _projectService: IProjectService
  ) {}

  getAllProjects = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.query as { userId: string; role: string };
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._projectService.fetchAllProjects(
      req.details.orgId as string,
      userId,
      role,
      query
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  markProjectAsCompleted = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { projectId } = req.query as { projectId: string };
    await this._projectService.markProjectAsCompleted(
      req.details.orgId,
      projectId
    );
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };
}
