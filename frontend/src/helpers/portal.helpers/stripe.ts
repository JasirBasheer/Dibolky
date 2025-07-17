import axios from "../../utils/axios";
import { FormData, IStripeDetails } from "../../types/portal.types";
import { IPlan } from "@/types/admin.types";


export  const handleStripePayment = async (formData:FormData,plan:IPlan,selectedCurrency:string):Promise<{url:string}> => {
    try {
        const details:IStripeDetails ={
            name: formData.firstName + ' ' + formData.lastName,
            ...formData,
            plan,
            amount:plan?.price * formData.validity || 0,
            currency:selectedCurrency,
            description: plan?.description || "Plan Subscription"
        }
        console.log('reachedhere')
        const response = await axios.post('api/payment/stripe',{details,success_url:`http://localhost:5173/agency/login?new=true`,cancel_url:`http://localhost:5173/payment/failed`})
        return {url:response.data.url}

    } catch (error) {
        console.error('Payment initiation failed:', error);
        throw error
    }
};



