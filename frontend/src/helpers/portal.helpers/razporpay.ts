import axios from "../../utils/axios";
import { FormData } from "../../types/portal.types";
import { message } from "antd";
import notificationSound from '../../assets/audios/currectanswer.wav'
import notificationSound2 from '../../assets/audios/notification-2-269292.mp3'
import { NavigateFunction } from "react-router-dom";
import { IPlan } from "@/types/admin.types";
import { IRazorpayOrder } from "@/types/payment.types";
import { createAgencyApi, createInfluencerApi } from "@/services/portal/post.services";




  
export  const handleRazorpayPayment = async (
    formData:FormData,
    plan:IPlan,
    navigate:NavigateFunction,
    selectedCurrency:string
) => {
    try {
        const response = await axios.post('/api/payment/razorpay', {
            amount: plan?.price * formData.validity|| 0,
            currency: selectedCurrency,
        });

        const { id: order_id, amount, currency } = response.data.data;

        const options = {
            key: "rzp_test_fKh2fGYnPvSVrM",
            amount: amount,
            currency: currency,
            name: plan?.planName || "Subscription Plan",
            description: plan?.planDescription || "Plan Subscription",
            order_id: order_id,
            handler: (response: IRazorpayOrder) => {
                if (response) {
                    handlePaymentSuccess(
                        response,
                        formData,
                        plan,plan.planType,
                        navigate,currency
                    )
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error('Payment initiation failed:', error);
    }
};




const handlePaymentSuccess = async (
    response: IRazorpayOrder,
    formData:FormData,
    plan:IPlan,platform:string,
    navigate:NavigateFunction,
    currency:string
) => {
    const details = {
        organizationName: formData.organizationName,
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        address: {
            city: formData.city,
            country: formData.country
        },
        website: formData.website,
        password: formData.password,
        contactNumber: formData.phone,
        logo: "",
        industry: formData.industry,
        planId:plan._id,
        validity:formData.validity,
        planPurchasedRate:plan?.price * formData.validity,
        paymentGateway:"razorpay",
        description:plan.planName + " "+"Purchased",
        currency
    }

    if (platform == "agency") {

        const res = await createAgencyApi(details,response.razorpay_payment_id)
        if (res.status == 201) {
            setTimeout(() => {
                message.success('Agnecy successfully created')
                new Audio(notificationSound).play()
            }, 100)

            setTimeout(() => {
                message.success('Login to continue')
                new Audio(notificationSound2).play()
            }, 500)
            navigate('/agency/login')
        }
    } else {
        const res = await createInfluencerApi(details,response.razorpay_payment_id)

        if (res.status == 201) {
            setTimeout(() => {
                message.success('Influencer have been successfully created')
                new Audio(notificationSound).play()
            }, 100)

            setTimeout(() => {
                message.success('Login to continue')
                new Audio(notificationSound2).play()
            }, 500)
            navigate('/influencer/login')
        }
    }

}