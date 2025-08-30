export interface IRazorpayOrder {
  razorpay_payment_id?:string;
  razorpay_order_id?:string;
  razorpay_signature?:string;
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes?: Record<string, string | number | null>; 
  offer_id: string | null;
  receipt: string | null;
  status: string;
  key_id: string
}



export interface IUserDetails {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  organizationName: string;
  website: string;
  city: string;
  country: string;
  industry: string;
  validity: number;
  planId: string;
  platform: string;
  amount: number;
  currency: string;
  description: string;
}
