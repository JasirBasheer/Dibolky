import { Model, Schema, Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { connectTenantDB } from "@/config/db.config";
import { IInvoiceRepository } from "../Interface/IInvocieRepository";
import { IInvoice } from "@/models";
import { FilterType } from "@/types/invoice";

@injectable()
export class InoviceRepository
  extends BaseRepository<IInvoice>
  implements IInvoiceRepository
{
  private _clientSchema: Schema;
  private _modelName = "invoice";
  private _models: Map<string, Model<IInvoice>> = new Map();

  constructor(@inject("invoice_modal") schema: Schema) {
    super(null as unknown as Model<IInvoice>);
    this._clientSchema = schema;
  }

  private async getModel(orgId: string): Promise<Model<IInvoice>> {
    if (this._models.has(orgId)) {
      return this._models.get(orgId)!;
    }
    const connection = await connectTenantDB(orgId);
    if (!connection) throw new Error("Connection not found");
    let model: Model<IInvoice> = connection.model<IInvoice>(
      this._modelName,
      this._clientSchema
    );
    this._models.set(orgId, model);
    return model;
  }

  async createInvoice(orgId: string, deatils: object): Promise<void> {
    const model = await this.getModel(orgId);

    const newInovice = new model(deatils);
    const createdInvoice = await newInovice.save();
    if (!createdInvoice)
      throw new CustomError(
        "An unexpected error occured while creating invoice please try again later.",
        500
      );
  }

  async getAllInvoices(
  orgId: string,
  filter: Record<string, unknown> = {},
  options?: { page?: number; limit?: number; sort?: any }
): Promise<{ invoices: IInvoice[]; totalCount: number; totalPages: number }> {
  const model = await this.getModel(orgId);
  const { page, limit, sort } = options || {};
  const totalCount = await model.countDocuments(filter);

  let query = model.find(filter);
  if (sort) query = query.sort(sort);
  if (limit > 0) query = query.skip((page - 1) * limit).limit(limit);

  const invoices = await query.exec();
  return {
    invoices,
    totalCount,
    totalPages: limit ? Math.ceil(totalCount / limit) : 1,
  };
}

  async getInvoiceById(orgId: string, invoice_id: string): Promise<IInvoice | null >{
    const model = await this.getModel(orgId);
    return await model.findOne({_id:invoice_id})
  }

  async updateInvoiceStatus(orgId: string, invoice_id: string): Promise<IInvoice | null >{
    const model = await this.getModel(orgId);
    return await model.findOneAndUpdate({_id:invoice_id},{isPaid:true,paidDate: new Date()})
  }


}
