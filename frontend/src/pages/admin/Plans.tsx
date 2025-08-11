import React, { useState, useEffect } from "react";
import { ListFilterPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddPlan from "@/components/admin/AddPlan";
import axios from "../../utils/axios";
import { IPlan } from "@/types/admin.types";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import EditPlan from "@/components/admin/EditPlan";
import PlanDetails from "@/components/admin/planDetails";

const Plans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isAddPlan, setIsAddPlan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlanDetails, setIsPlanDetails] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<IPlan | null>(null);
  const [planId, setPlanId] = useState("");

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/admin/plans");
      setPlans(response.data.plans);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (id: string) => {
    setPlanId(id);
    setIsPlanDetails(true);
  };

  const handleEditPlanClick = (plan: IPlan) => {
    setPlanToEdit(plan);
    setIsEditing(true);
  };

  const renderPlanList = (planList: IPlan[] = []) => (
    <div className="w-full space-y-2">
      {planList.map((plan: IPlan) => (
        <div
          onClick={() => {
            setIsPlanDetails(true);
            setPlanId(plan._id);
          }}
          key={plan._id}
          className="w-full p-3 bg-slate-50 rounded-md hover:shadow-md 
                     transition-all duration-300 cursor-pointer
                     flex items-center justify-between"
        >
          <span className="text-sm font-medium">{plan.name}</span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEditPlanClick(plan);
            }}
            variant="outline"
            size="icon"
            className="ml-2"
          >
            <ListFilterPlus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Admin", "/admin"],
          ["Plans", ""],
        ]}
      />
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setIsAddPlan(true)}
            className="flex items-center gap-2"
          >
            <ListFilterPlus className="h-4 w-4" />
            Add Plan
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Plans</CardTitle>
            </CardHeader>
            <CardContent>{renderPlanList(plans)}</CardContent>
          </Card>
        </div>

        {isEditing && planToEdit && (
          <EditPlan setIsEditPlan={setIsEditing} plan={planToEdit} />
        )}
        {isAddPlan && <AddPlan setIsAddPlan={setIsAddPlan} />}
        {isPlanDetails && (
          <PlanDetails
            setIsPlanDetails={setIsPlanDetails}
            planId={planId}
            setPlans={setPlans}
          />
        )}
      </div>
    </>
  );
};

export default Plans;
