import { inject, injectable } from "tsyringe";
import { IProjectRepository } from "@/repositories";
import { IProjectService } from "../Interface/IProjectService";
import { MappedProjectType } from "@/types";
import { FilterType, QueryParser, ROLES } from "@/utils";
import mongoose from "mongoose";
import { CommonMapper } from "@/mappers/common-mapper";
import { NotFoundError } from "mern.common";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject("ProjectRepository")
    private readonly _projectRepository: IProjectRepository
  ) {}

  async fetchAllProjects(
    orgId: string,
    userId: string,
    role: string,
    query: FilterType
  ): Promise<{ projects: MappedProjectType[]; totalPages: number } | null> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: [
        "client.client_name",
        "service_name",
        "category",
        "status",
      ],
      additionalFilters: {
        ...(query.status && query.status !== "all"
          ? { status: query.status }
          : {}),
        ...(role !== ROLES.AGENCY && {
          "client.clientId": new mongoose.Types.ObjectId(userId),
        }),
        ...(query.type != "all" && { category: query.type }),
      },
    });
    const options = {
      page,
      limit,
      sort: sortBy
        ? ({ [sortBy]: sortOrder === "desc" ? -1 : 1 } as Record<
            string,
            1 | -1
          >)
        : {},
    };

    const result = await this._projectRepository.fetchAllProjects(
      orgId,
      filter,
      options
    );
    return CommonMapper.ProjectDetails(result);
  }

  async markProjectAsCompleted(
    orgId: string,
    projectId: string
  ): Promise<void> {
    const project = await this._projectRepository.getProjectById(
      orgId,
      projectId
    );
    if (!project)
      throw new NotFoundError("Project not found please try again..");
    await this._projectRepository.editProjectStatus(
      orgId,
      projectId,
      "Completed"
    );
  }
}
