import { BaseRepository } from "mern.common";
import { IProject } from "../../models/Implementation/project";


export interface IProjectRepository extends BaseRepository<IProject> {
    createProject(orgId: string, clientId: string, client_name: string, service_name: string, project: object, category: string, dead_line: Date): Promise<void>;
    fetchAllProjects(orgId: string,page?:number): Promise<{projects:IProject[],totalPages:number}>;
    editProjectStatus(orgId:string,projectId:string,status:string):Promise<IProject | null>
    getProjectsByClientId(orgId:string,clientId:string):Promise<IProject[] | null>
}