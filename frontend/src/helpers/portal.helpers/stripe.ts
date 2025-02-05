import axios from "../../utils/axios";
import { FormData } from "../../types/portalTypes";


export  const handleStripePayment = async (formData:FormData,plan:any,platform:string,selectedCurrency:string):Promise<any> => {
    try {
        const details:any ={
            ...formData,
            plan,
            platform,
            amount:plan?.price * formData.validity || 0,
            currency:selectedCurrency,
            name: plan?.title || "Subscription Plan",
            description: plan?.description || "Plan Subscription"
        }
        const response = await axios.post('api/payment/stripe',{details,success_url:`http://localhost:5173/${platform.toLowerCase()}/login?new=true`,cancel_url:`http://localhost:5173/payment/failed`})
        return response.data

    } catch (error) {
        console.error('Payment initiation failed:', error);
    }
};



