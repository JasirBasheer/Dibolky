"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { Check, Star } from "lucide-react"
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs"

// Mock API function - replace with your actual API call
const getAllPlansApi = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: 1,
      name: "Basic",
      price: 9.99,
      billing: "monthly",
      description: "Perfect for individuals getting started",
      features: ["5 Projects", "10GB Storage", "Email Support", "Basic Analytics"],
      popular: false,
    },
    {
      id: 2,
      name: "Pro",
      price: 19.99,
      billing: "monthly",
      description: "Best for growing teams and businesses",
      features: [
        "25 Projects",
        "100GB Storage",
        "Priority Support",
        "Advanced Analytics",
        "Team Collaboration",
        "Custom Integrations",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Enterprise",
      price: 49.99,
      billing: "monthly",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited Projects",
        "1TB Storage",
        "24/7 Phone Support",
        "Advanced Security",
        "Custom Branding",
        "API Access",
        "Dedicated Account Manager",
      ],
      popular: false,
    },
  ]
}

const UpgradePlan = () => {
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: getAllPlansApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) {
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load plans. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
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
        {plans?.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-200 hover:shadow-lg`}
          >


            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.billing}</span>
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
