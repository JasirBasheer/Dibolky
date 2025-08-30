import axios from "../../utils/axios";
import { FormData, IStripeDetails } from "../../types/portal.types";
import { Plan } from "@/types";

export const handleStripePayment = async (
  formData: FormData,
  plan: Plan
): Promise<{ url: string }> => {
  try {
    const details: IStripeDetails = {
      name: formData.firstName + " " + formData.lastName,
      ...formData,
      planId: plan.id,
      amount: plan?.price * formData.validity || 0,
      description: plan?.description || "Plan Subscription",
    };
    const response = await axios.post("api/payment/stripe", {
      details,
      success_url: `${import.meta.env.VITE_BACKEND}/agency/login?new=true`,
      cancel_url: `${import.meta.env.VITE_BACKEND}/payment/failed`,
    });
    return { url: response.data.url };
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  }
};
