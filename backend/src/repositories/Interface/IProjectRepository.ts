import { BaseRepository } from "mern.common";
import { IProject } from "../../models/Implementation/project";

export interface IProjectRepository extends BaseRepository<IProject> {
  createProject(
    orgId: string,
    clientId: string,
    client_name: string,
    service_name: string,
    project: object,
    category: string,
    dead_line: Date
  ): Promise<void>;

  fetchAllProjects(
    orgId: string,
    filter?: Record<string, unknown>,
    options?: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
  ): Promise<{ projects: IProject[]; totalCount: number; totalPages: number }>;

  editProjectStatus(
    orgId: string,
    projectId: string,
    status: string
  ): Promise<IProject | null>;

  getProjectsByClientId(
    orgId: string,
    clientId: string
  ): Promise<IProject[] | null>;

  getProjectById(
    orgId: string,
    projectId: string
  ): Promise<IProject[] | null>;
}
