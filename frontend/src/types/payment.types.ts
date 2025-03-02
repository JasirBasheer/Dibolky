declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
  }

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    image?: string;
    order_id?: string;
    handler?: (response: IRazorpayOrder) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
  }
  
export interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: (response: IRazorpayOrder) => void) => void;
    close: () => void;
  }


  export interface IRazorpayOrder {
    razorpay_payment_id:string;
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