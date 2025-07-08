import React, { useEffect, useState } from 'react';
import { ListFilterPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddPlan from '@/components/admin.components/AddPlan';
import PlanDetails from '@/components/admin.components/planDetails';
import axios from '../../utils/axios';
import { IPlan } from '@/types/admin.types';





const Plans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isAddPlan, setIsAddPlan] = useState(false);
  const [isPlanDetails, setIsPlanDetails] = useState(false);
  const [planId, setPlanId] = useState('');

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/admin/plans');
      setPlans(response.data.plans);
    } catch (error: unknown) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (id: string) => {
    setPlanId(id);
    setIsPlanDetails(true);
  };

  const renderPlanList = (planList: IPlan[] = []) => (
    <div className="w-full space-y-2">
      {planList.map((plan:IPlan) => (
        <div
          key={plan._id}
          onClick={() => handlePlanClick(plan._id as string)}
          className="w-full p-3 bg-slate-50 rounded-md hover:shadow-md 
                     transition-all duration-300 cursor-pointer
                     flex items-center justify-between"
        >
          <span className="text-sm font-medium">{plan.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plans</h1>
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
          <CardContent>
          {renderPlanList(plans)}
          </CardContent>
        </Card>

      </div>

      {isAddPlan && <AddPlan setIsAddPlan={setIsAddPlan} />}
      {isPlanDetails && (
        <PlanDetails
          setIsPlanDetails={setIsPlanDetails}
          planId={planId}
        />
      )}
    </div>
  );
};

export default Plans;