import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { X, Users, Package, Edit, Ban, Trash2 } from 'lucide-react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Skeleton from 'react-loading-skeleton';
import { message } from 'antd';
import { IAdminPlan, PlanConsumer } from '@/types/admin.types';
import { getPlanDetailsApi } from '@/services/admin/get.services';
import { changePlanStatusApi } from '@/services/admin/post.services';

interface PlanDetailsProps {
  setIsPlanDetails: Dispatch<SetStateAction<boolean>>;
  planId: string;
  entity: string;
}

const PlanDetails = ({ setIsPlanDetails, planId, entity }: PlanDetailsProps) => {
  const [details, setDetails] = useState<IAdminPlan>();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);

  console.log("detailssss",details)
  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const res = await getPlanDetailsApi(entity,planId)
      const menu: string[] = [];
      for (const m in res.data.details.menu) {
        menu.push(m);
      }
      res.data.details.menu = menu;
      setDetails(res.data.details);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, []);

  const handleBlock = async(entity:string,plan_id:string) => {
   const res =  await changePlanStatusApi(entity,plan_id)
   console.log(res)
   if(res.status == 200){
    message.success("Plan status changed successfully")
    await fetchPlanDetails()
   }
  };

  const AboutTabSkeleton = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Skeleton className="h-4 w-20 mb-3" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-1.5 w-1.5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-36 mb-3" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ConsumersTabSkeleton = () => (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36 mt-3" />
          </div>
        ))}
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div className="bg-gray-50 rounded-lg p-6 ">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{details?.title}</h3>
            <p className="text-gray-600 text-sm">{details?.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <BsThreeDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Plan
              </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={()=>handleBlock(entity,planId)}>
                <Ban className="mr-2 h-4 w-4" /> 
                {details?.isActive ? "Block plan":"Unblock plan"}
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Plan Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-xl font-semibold">${details?.price}</div>
                <div className="text-sm text-gray-500">per {details?.validity}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Features</div>
                <div className="space-y-2">
                  {details?.features?.map((feature: string, index: number) => (
                    <div key={index} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Available Modules</h4>
            <div className="flex flex-wrap gap-2">
              {details?.menu?.map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="capitalize px-3 py-1">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ConsumersTab = () => (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-gray-500" />
        <span className="font-medium">Current Subscribers</span>
      </div>

      <div className="space-y-4">
        {details?.planConsumers?.map((consumer: PlanConsumer, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-50 p-6 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium">{consumer.name}</h4>
                <p className="text-sm text-gray-600">{consumer.organizationName}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {consumer.industry}
              </Badge>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              Valid until: {new Date(consumer.validity).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-[-2rem] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setIsPlanDetails(false)}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl"
      >
        <Card className="w-full h-full">
          <div className="border-b px-4 py-4 flex items-center justify-between">
            <div className="flex gap-4">
              <motion.button
                className={`text-base font-medium transition-colors ${
                  activeTab === 'about' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('about')}
              >
                About
              </motion.button>
              <motion.button

                className={`text-base font-medium transition-colors ${
                  activeTab === 'consumers' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('consumers')}
              >
                Consumers
              </motion.button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsPlanDetails(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <CardContent className="p-4">
            <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pr-4 space-y-8 [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {loading ? (
                    activeTab === 'about' ? <AboutTabSkeleton /> : <ConsumersTabSkeleton />
                  ) : (
                    activeTab === 'about' ? <AboutTab /> : <ConsumersTab />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PlanDetails;