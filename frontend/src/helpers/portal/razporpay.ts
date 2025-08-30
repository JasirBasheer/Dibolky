import api from "../../utils/axios";
import { FormData } from "../../types/portal.types";
import notificationSound from "../../assets/audios/currectanswer.wav";
import { NavigateFunction } from "react-router-dom";
import { IRazorpayOrder } from "@/types/payment.types";
import { createAgencyApi } from "@/services/portal/post.services";
import { toast } from "sonner";
import { Plan } from "@/types";
import axios from "axios";

export const handleRazorpayPayment = async (
  formData: FormData,
  plan: Plan,
  navigate: NavigateFunction
) => {
  try {
    const response = await api.post("/api/payment/razorpay", {
      amount: plan?.price * formData.validity || 0,
      currency: "USD",
    });

    if (!response) {
      toast.error("Unable to initiate payment. Please try again.");
      return;
    }

    const { id: order_id, amount, currency } = response.data.data;
    const options = {
      key: "rzp_test_fKh2fGYnPvSVrM",
      amount: amount,
      currency: currency,
      name: plan?.name || "Subscription Plan",
      description: plan?.description || "Plan Subscription",
      order_id: order_id,
      handler: (response: IRazorpayOrder) => {
        if (!response?.razorpay_payment_id) {
          toast.error("Payment failed or was cancelled.");
          return;
        }
        handlePaymentSuccess(response, formData, plan, navigate);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#3399cc" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch {
    toast.error("Payment initiation failed. Please try again later.");
  }
};

const handlePaymentSuccess = async (
  response: IRazorpayOrder,
  formData: FormData,
  plan: Plan,
  navigate: NavigateFunction
) => {
  const details = {
    organizationName: formData.organizationName,
    name: formData.firstName + " " + formData.lastName,
    email: formData.email,
    address: {
      city: formData.city,
      country: formData.country,
    },
    website: formData.website,
    password: formData.password,
    contactNumber: formData.phone,
    logo: "",
    industry: formData.industry,
    planId: plan.id,
    validity: formData.validity,
    planPurchasedRate: plan?.price * formData.validity,
    paymentGateway: "razorpay",
    description: plan.name + " " + "Purchased",
    currency: "USD",
  };

  try {
    const res = await createAgencyApi(details, response.razorpay_payment_id);

    if (res.status === 201) {
      setTimeout(() => {
        toast.success("Agency successfully created, Login to continue..");
        new Audio(notificationSound).play();
      }, 100);
      navigate("/agency/login");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        toast.error(
          error.response?.data?.error || "Account already exists, please login."
        );
      } else {
        toast.error(
          error.response?.data?.error ||
            "Something went wrong, please try again."
        );
      }
    } else {
      toast.error("Unexpected error occurred. Please try again.");
    }
  }
};
