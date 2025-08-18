import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FreeTrialPurchase from "./components/free-trail.purchase"
import { Check, CircleArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchTrialPlans } from "@/services/portal/get.services"
import { IPlan } from "@/types/admin.types"
import Skeleton from "react-loading-skeleton"


export function FreeTrialCards() {

  const { data: trialPlans, isLoading: isTrialPlansLoading } = useQuery({
    queryKey: ["get-trial-plans"],
    queryFn: () => {
      return fetchTrialPlans()
    },
    select: (data) => data?.data.plans,
    staleTime: 1000 * 60 * 60,
  })
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null)

  function onClose() {
    setSelectedTrial("")
  }


  return (
    <>
      {selectedTrial &&
        <FreeTrialPurchase
          planId={selectedTrial}
          onClose={onClose} />
      }
      <div className="min-h-screen p-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <CircleArrowLeft className="w-6 h-6" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center  gap-8 mt-16">
          {isTrialPlansLoading ? (<>
          <Skeleton width={250} height={400}/>
          <Skeleton width={250} height={400}/>
          </>) :
            (
              trialPlans?.map((trialPlan: IPlan) => {
                return (
                  <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 md:w-[22rem]">
                    <CardHeader className="pb-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-black">{trialPlan.name}</CardTitle>
                      </div>
                      <p className="text-sm text-gray-600">
                        {trialPlan.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {trialPlan.features.map((feature: string) => (
                          <div key={feature} className="flex items-start">
                            <Check className="w-5 h-5 text-black mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full bg-black text-white hover:bg-gray-800 h-11" onClick={() => setSelectedTrial(trialPlan._id as string)}>Start Free Trial</Button>
                      <p className="text-xs text-gray-500 text-center">No credit card required. 30-day free trial.</p>
                    </CardContent>
                  </Card>
                )
              })
            )}
        </div>
      </div>
    </>
  )
}

