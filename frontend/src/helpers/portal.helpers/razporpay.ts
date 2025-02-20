import axios from "../../utils/axios";
import { FormData } from "../../types/portalTypes";
import { message } from "antd";
import notificationSound from '../../assets/audios/currectanswer.wav'
import notificationSound2 from '../../assets/audios/notification-2-269292.mp3'
export  const handleRazorpayPayment = async (formData:FormData,plan:any,platform:string,navigate:any,selectedCurrency:string) => {
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
            name: plan?.title || "Subscription Plan",
            description: plan?.description || "Plan Subscription",
            order_id: order_id,
            handler: (response: any) => {
                if (response) {
                    handlePaymentSuccess(response,formData,plan,platform,navigate,currency)
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

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error('Payment initiation failed:', error);
    }
};




const handlePaymentSuccess = async (response: any,formData:FormData,plan:any,platform:string,navigate:any,currency:any) => {
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
        description:plan.title + " "+"Purchased",
        currency
    }

    if (platform == "Agency") {

        console.log("details",details,"response",response.razorpay_payment_id);
        
        const res = await axios.post('/api/entities/create-agency', {details,transaction_id:response.razorpay_payment_id})
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
        const res = await axios.post('/api/entities/create-company', details, response)
        if (res.status == 201) {
            setTimeout(() => {
                message.success('Company have been successfully')
                new Audio(notificationSound).play()
            }, 100)

            setTimeout(() => {
                message.success('Login to continue')
                new Audio(notificationSound2).play()
            }, 500)
            navigate('/company/login')
        }
    }

}