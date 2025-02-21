import { BaseRepository } from "mern.common";
import { IProject } from "../../models/agency/project.model";


export interface IProjectRepository extends BaseRepository<IProject> {
    createProject(orgId: string, clientId: string, client_name: string, service_name: string, project: object, category: string, dead_line: Date): Promise<IProject>;
    fetchAllProjects(orgId: string): Promise<Partial<IProject[]> | null>;
}