
export interface IInvoiceType {
   _id?:string; 
  invoiceNumber?: string;
  agencyId: string;
  client: {
    clientId: string;
    clientName: string;
    email: string;
  };
  service: {
    serviceName: string;
    details: object;
  };
  pricing: number;
  dueDate: Date;
  isPaid: boolean; 
  orgId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FilterType{
    page: number,
    limit: number,
    query?: string,
    status?: string,
    sortBy?: string,
    sortOrder?: string,
    overdues?:boolean | string,
    type?:string
}
