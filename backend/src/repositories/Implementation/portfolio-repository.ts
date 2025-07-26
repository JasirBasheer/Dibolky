import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { connectTenantDB } from "@/config/db.config";
import { IPortfolio } from "@/models";
import { IPortfolioRepository } from "../Interface/IPortfolioRepository";

@injectable()
export class PortfolioRepository
  extends BaseRepository<IPortfolio>
  implements IPortfolioRepository
{
  private _socialUser: Schema;
  private _modelName = "portfolio";
  private _models: Map<string, Model<IPortfolio>> = new Map();

  constructor(@inject("portfolio_modal") schema: Schema) {
    super(null as unknown as Model<IPortfolio>);
    this._socialUser = schema;
  }

  private async getModel(orgId: string): Promise<Model<IPortfolio>> {
    if (this._models.has(orgId)) {
      return this._models.get(orgId)!;
    }
    const connection = await connectTenantDB(orgId);
    if (!connection) throw new Error("Connection not found");
    let model: Model<IPortfolio> = connection.model<IPortfolio>(
      this._modelName,
      this._socialUser
    );
    this._models.set(orgId, model);
    return model;
  }

  async createPortfolio(orgId: string, details: any): Promise<IPortfolio> {
    const model = await this.getModel(orgId);
    const note = new model(details);
    return await note.save();
  }

  async editPortfolio(orgId: string, details: any): Promise<IPortfolio> {
    const model = await this.getModel(orgId);
    const updatedPortfolio = await model.findByIdAndUpdate(
      { _id: details._id },
      { ...details }
    );
    return await updatedPortfolio.save();
  }

    async getPortfolios(orgId: string, type:string): Promise<IPortfolio[]> {
    const model = await this.getModel(orgId);
    return await model.find({type})
  }
  
}
