import React, { useEffect, useState } from 'react';
import { ListFilterPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddPlan from '@/components/admin.components/AddPlan';
import PlanDetails from '@/components/admin.components/planDetails';
import axios from '../../utils/axios';
import { IPlan, IPlans } from '@/types/admin.types';



interface PlansData {
  Agency: IPlans;
  Influencer: IPlans;
}

const Plans = () => {
  const [plans, setPlans] = useState<PlansData>();
  const [isAddPlan, setIsAddPlan] = useState(false);
  const [isPlanDetails, setIsPlanDetails] = useState(false);
  const [planId, setPlanId] = useState('');
  const [entity, setEntity] = useState<'Agency' | 'Influencer'>('Agency');

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/public/get-all-plans');
      setPlans(response.data.plans);
    } catch (error: unknown) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (id: string, entityType: 'Agency' | 'Influencer') => {
    setPlanId(id);
    setEntity(entityType);
    setIsPlanDetails(true);
  };

  const renderPlanList = (planList: IPlan[], entityType: 'Agency' | 'Influencer') => (
    <div className="w-full space-y-2">
      {planList.map((plan:IPlan) => (
        <div
          key={plan._id}
          onClick={() => handlePlanClick(plan._id as string, entityType)}
          className="w-full p-3 bg-slate-50 rounded-md hover:shadow-md 
                     transition-all duration-300 cursor-pointer
                     flex items-center justify-between"
        >
          <span className="text-sm font-medium">{plan.title}</span>
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
          {renderPlanList(Array.isArray(plans?.Agency) ? plans.Agency : [], 'Agency')}
          </CardContent>
        </Card>

      </div>

      {isAddPlan && <AddPlan setIsAddPlan={setIsAddPlan} />}
      {isPlanDetails && (
        <PlanDetails
          setIsPlanDetails={setIsPlanDetails}
          planId={planId}
          entity={entity}
        />
      )}
    </div>
  );
};

export default Plans;