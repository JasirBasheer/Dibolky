import Razorpay from "razorpay";

export function createRazorpayInstance(key_id: string, key_secret: string) {
  return new Razorpay({
    key_id,
    key_secret,
  });
}
