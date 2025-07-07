import { inject, injectable } from "tsyringe";
import { IProject } from "../../models/project";
import { BaseRepository } from "mern.common";
import { IProjectRepository } from "../Interface/IProjectRepository";
import { Model, Schema } from "mongoose";
import { connectTenantDB } from "../../config/db.config";


@injectable()
export class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
    private projectSchema: Schema;
    private modelName = 'project';
    private models: Map<string, Model<IProject>> = new Map();


    constructor(
        @inject('project_model') schema: Schema
    ) {
        super(null as unknown as Model<IProject>);
        this.projectSchema = schema;
    }


    private async getModel(
        orgId: string
    ): Promise<Model<IProject>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!;
        }

        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IProject> = connection.model<IProject>(this.modelName, this.projectSchema);
        this.models.set(orgId, model);
        return model;
    }

    async createProject(
        orgId: string, 
        clientId: string, 
        client_name: string, 
        service_name: string, 
        service_details: object, 
        category: string, 
        dead_line: Date
    ): Promise<void> {
        const model = await this.getModel(orgId);
        await model.create({orgId,client:{clientId,client_name},service_name,service_details,category,dead_line});
    }

    async fetchAllProjects(
        orgId: string,
        page?:number
    ): Promise<{projects:IProject[],totalPages:number}> {
        const model = await this.getModel(orgId);
        let projects;
        const limit = 10
        const totalCount = await model.countDocuments({});
        const totalPages = Math.ceil(totalCount / limit);
    
        if(page){
            const skip = (page - 1) * limit;
            projects = await model.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); 
            
        }else{
            projects = await model.find({});
        }
        return {projects,totalPages}
    }

    async editProjectStatus(
        orgId:string,
        projectId:string,
        status:string
    ):Promise<IProject | null>{
        const model = await this.getModel(orgId);
        return null
    }

}