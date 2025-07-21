import { IInvoice } from "@/models";
import { IBaseRepository } from "mern.common";

export interface IInvoiceRepository extends IBaseRepository<IInvoice> {
  createInvoice(orgId: string, details: object): Promise<void>;
  getAllInvoices(
    orgId: string,
    filter: Record<string, unknown>,
    options?: { page?: number; limit?: number; sort?: any }
  ): Promise<{ invoices: IInvoice[]; totalCount: number; totalPages: number }>;
  getInvoiceById(orgId: string, invoice_id: string): Promise<IInvoice | null>;
  updateInvoiceStatus(orgId: string, invoice_id: string): Promise<IInvoice >;

}
