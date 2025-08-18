import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Check } from "lucide-react"
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs"
import { getAllUpgradablePlansApi } from "@/services/agency/get.services"
import axios from "@/utils/axios"
import { IRazorpayOrder } from "@/types/payment.types"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/slices/user.slice"
import { setAgency } from "@/redux/slices/agency.slice"


const UpgradePlan = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient();
  const { data: upgradableplans, isLoading: isUpgradablePlansLoading } = useQuery({
    queryKey: ["get-upgradable-plans"],
    queryFn: () => {
      return getAllUpgradablePlansApi()
    },
    select: (data) => data?.data.upgradablePlans,
    staleTime: 1000 * 60 * 60,
  })


  const upgradePlan = async(plan) =>{
    console.log(plan)
          const response = await axios.post('/api/payment/razorpay', {
            amount: plan?.price || 0,
            currency: "USD",
        });

        const { id: order_id, amount, currency } = response.data.data;

        const options = {
            key: "rzp_test_fKh2fGYnPvSVrM",
            amount: amount,
            currency: currency,
            name: plan?.name || "Subscription Plan",
            description: plan?.description || "Plan Subscription",
            order_id: order_id,
            handler: async(response: IRazorpayOrder) => {
                if (response) {
                const response =  await axios.post('/api/agency/plans',{planId:plan._id})
                if(response.status == 200){
                  dispatch(setUser({planId:plan._id}))
                  dispatch(setAgency({planId:plan._id}))
                  queryClient.invalidateQueries({ queryKey: ["get-upgradable-plans"] });
                  toast.success('plan upgraded successfully.')
                }else{
                  toast.error("an unexpected error occured during plan upgradation please try again later..")
                }
                }
            },
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
  }




  if (isUpgradablePlansLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }



  return (
    <>
            <CustomBreadCrumbs
        breadCrumbs={[
          ["Tools & Settings", "/agency"],
          ["Settings", ""],
        ]}
      />
    <div className="container mx-auto p-6">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {upgradableplans?.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-200 hover:shadow-lg`}
          >


            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.billingCycle}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full variant-outline`}
                size="lg"
                onClick={() => upgradePlan(plan)}
              >
              Upgrade now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
    </>
  )
}

export default UpgradePlan
