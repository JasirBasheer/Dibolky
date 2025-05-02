import { useState } from "react"
import { AlertTriangle, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlanExpiredModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: {
    name: string
    price: number
    features: string[]
  }
  upgradePlans: Array<{
    name: string
    price: number
    features: string[]
    popular?: boolean
  }>
}

export default function PlanExpiredModal({
  isOpen,
  onClose,
  currentPlan = {
    name: "Basic",
    price: 9.99,
    features: ["5 Projects", "10GB Storage", "Basic Support"],
  },
  upgradePlans = [
    {
      name: "Pro",
      price: 19.99,
      features: ["15 Projects", "50GB Storage", "Priority Support", "API Access"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 49.99,
      features: ["Unlimited Projects", "500GB Storage", "24/7 Support", "API Access", "Custom Integrations"],
    },
  ],
}: PlanExpiredModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleRenewCurrentPlan = () => {
    // Handle renewal logic here
    console.log("Renewing current plan:", currentPlan.name)
    onClose()
  }

  const handleUpgradePlan = () => {
    // Handle upgrade logic here
    console.log("Upgrading to plan:", selectedPlan)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <Badge variant="outline" className="text-amber-500 border-amber-500">
              Plan Expired
            </Badge>
          </div>
          <DialogTitle className="text-xl">Your subscription has expired</DialogTitle>
          <DialogDescription>
            Your {currentPlan.name} plan has expired. Please renew your current plan or upgrade to continue using our
            services.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className={`border-2 ${selectedPlan === "current" ? "border-primary" : "border-border"} transition-all`}
              onClick={() => setSelectedPlan("current")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{currentPlan.name}</CardTitle>
                <CardDescription>Current Plan</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-2xl font-bold">
                  ${currentPlan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={selectedPlan === "current" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedPlan("current")}
                >
                  Renew Plan
                </Button>
              </CardFooter>
            </Card>

            {upgradePlans.map((plan, index) => (
              <Card
                key={index}
                className={`border-2 relative ${selectedPlan === plan.name ? "border-primary" : "border-border"} ${plan.popular ? "shadow-md" : ""} transition-all`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && <Badge className="absolute -top-2 right-4">Popular</Badge>}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>Upgrade Plan</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-2xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === plan.name ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button
            onClick={selectedPlan === "current" ? handleRenewCurrentPlan : handleUpgradePlan}
            disabled={!selectedPlan}
            className="sm:w-auto w-full"
          >
            {selectedPlan === "current" ? "Renew Subscription" : "Upgrade Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

