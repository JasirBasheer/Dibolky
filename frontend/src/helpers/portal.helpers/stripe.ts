import axios from "../../utils/axios";
import { FormData } from "../../types/portal.types";


export  const handleStripePayment = async (formData:FormData,plan:any,platform:string,selectedCurrency:string):Promise<any> => {
    try {
        const details:any ={
            name: formData.firstName + ' ' + formData.lastName,
            ...formData,
            plan,
            platform,
            amount:plan?.price * formData.validity || 0,
            currency:selectedCurrency,
            description: plan?.description || "Plan Subscription"
        }
        const response = await axios.post('api/payment/stripe',{details,success_url:`http://localhost:5173/${platform.toLowerCase()}/login?new=true`,cancel_url:`http://localhost:5173/payment/failed`})
        return response.data

    } catch (error) {
        console.error('Payment initiation failed:', error);
    }
};



