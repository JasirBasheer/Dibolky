export interface ITransactionType {
    _id:string;
    orgId: string;
    planId?: string
    userId?: string;
    email: string;
    transactionId: string;
    paymentGateway: string;
    amount: number;
    description: string;
    currency: string;
    transactionType:string;
    createdAt?:Date

}