import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { connectTenantDB } from "@/config/db.config";
import { ITestimonialRepository } from "../Interface/ITestimonialRepository";
import { ITestimonial } from "@/models";

@injectable()
export class TestimonialRepository extends BaseRepository<ITestimonial> implements ITestimonialRepository
{
  private _socialUser: Schema;
  private _modelName = "testimonial";
  private _models: Map<string, Model<ITestimonial>> = new Map();

  constructor(@inject("testimonial_modal") schema: Schema) {
    super(null as unknown as Model<ITestimonial>);
    this._socialUser = schema;
  }

  private async getModel(orgId: string): Promise<Model<ITestimonial>> {
    if (this._models.has(orgId)) {
      return this._models.get(orgId)!;
    }
    const connection = await connectTenantDB(orgId);
    if (!connection) throw new Error("Connection not found");
    let model: Model<ITestimonial> = connection.model<ITestimonial>(
      this._modelName,
      this._socialUser
    );
    this._models.set(orgId, model);
    return model;
  }

  async createTestimonial(orgId: string, details: Partial<ITestimonial>): Promise<ITestimonial> {
    const model = await this.getModel(orgId);
    const note = new model(details);
    return await note.save();
  }

    async getAllTestimonials(orgId: string): Promise<ITestimonial[]> {
    const model = await this.getModel(orgId);
    return await model.find({}).sort({ createdAt: -1  }); 
  }
  
}
