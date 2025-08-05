import { inject, injectable } from "tsyringe";
import { IProject } from "../../models/Implementation/project";
import { BaseRepository } from "mern.common";
import { IProjectRepository } from "../Interface/IProjectRepository";
import { Model, Schema, Types } from "mongoose";
import { connectTenantDB } from "../../config/db.config";

@injectable()
export class ProjectRepository
  extends BaseRepository<IProject>
  implements IProjectRepository
{
  private projectSchema: Schema;
  private modelName = "project";
  private models: Map<string, Model<IProject>> = new Map();

  constructor(@inject("project_model") schema: Schema) {
    super(null as unknown as Model<IProject>);
    this.projectSchema = schema;
  }

  private async getModel(orgId: string): Promise<Model<IProject>> {
    if (this.models.has(orgId)) {
      return this.models.get(orgId)!;
    }

    const connection = await connectTenantDB(orgId);
    if (!connection) throw new Error("Connection not found");

    let model: Model<IProject> = connection.model<IProject>(
      this.modelName,
      this.projectSchema
    );
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
    await model.create({
      orgId,
      client: { clientId, client_name },
      service_name,
      service_details,
      category,
      dead_line,
    });
  }

  async fetchAllProjects(
    orgId: string,
    filter: Record<string, unknown> = {},
    options?: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
  ): Promise<{ projects: IProject[]; totalCount: number; totalPages: number }> {
    const model = await this.getModel(orgId);
    const { page, limit, sort } = options || {};
    const totalCount = await model.countDocuments(filter);

    let query = model.find(filter);
    if (sort) query = query.sort(sort);
    if (limit > 0) query = query.skip((page - 1) * limit).limit(limit);
    const projects = await query.exec();

    return {
      projects,
      totalCount,
      totalPages: limit ? Math.ceil(totalCount / limit) : 1,
    };
  }

  async editProjectStatus(
    orgId: string,
    projectId: string,
    status: string
  ): Promise<IProject | null> {
    const model = await this.getModel(orgId);
    return null;
  }

  async getProjectsByClientId(
    orgId: string,
    clientId: string
  ): Promise<IProject[] | null> {
    const model = await this.getModel(orgId);
    return await model.find({
      "client.clientId": new Types.ObjectId(clientId),
    });
  }
}
