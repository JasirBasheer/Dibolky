import React, { useEffect, useState } from 'react';
import { ListFilterPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddPlan from '@/components/admin.components/AddPlan';
import PlanDetails from '@/components/admin.components/planDetails';
import axios from '../../utils/axios';



interface PlansData {
  Agency: any[];
  Company: any[];
}

const Plans = () => {
  const [plans, setPlans] = useState<PlansData>({ Agency: [], Company: [] });
  const [isAddPlan, setIsAddPlan] = useState(false);
  const [isPlanDetails, setIsPlanDetails] = useState(false);
  const [planId, setPlanId] = useState('');
  const [entity, setEntity] = useState<'Agency' | 'Company'>('Agency');

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/entities/get-all-plans');
      setPlans(response.data.plans);
    } catch (error: any) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (id: string, entityType: 'Agency' | 'Company') => {
    setPlanId(id);
    setEntity(entityType);
    setIsPlanDetails(true);
  };

  const renderPlanList = (planList: any[], entityType: 'Agency' | 'Company') => (
    <div className="w-full space-y-2">
      {planList.map((plan) => (
        <div
          key={plan._id}
          onClick={() => handlePlanClick(plan._id, entityType)}
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
            {renderPlanList(plans.Agency, 'Agency')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {renderPlanList(plans.Company, 'Company')}
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