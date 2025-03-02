export interface IRazorpayOrder {
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
}

export interface IUserPlan {
    name:string
    menu: Record<string, object>;
    _id: string;
    title: string;
    description: string;
    price: number;
    validity: string;
    features: string[];
    isActive: boolean;
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
  plan: IUserPlan;
  platform: string;
  amount: number;
  currency: string;
  description: string;
}
