
export interface InvoiceType {
  _id: string;
  invoiceNumber: string;
  client: {
    clientId: string;
    clientName: string;
    email: string;
  };
  service: {
    serviceName: string;
    details: any;
  };
  pricing: number;
  dueDate: Date;
  isPaid: boolean;
  orgId: string;
  orgName: string;
  createdAt: string;
  updatedAt: string;
}