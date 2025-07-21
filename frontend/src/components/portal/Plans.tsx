import { useEffect, useState } from 'react';
import { FcCheckmark } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';
import { IPlan, IPlans } from '@/types/admin.types';
import { RootState } from '@/types/common';

const Plans = () => {
    const [plans, setPlans] =  useState<IPlan[]>([]); 
    const currency = useSelector((state:RootState)=>state.portal)
    const navigate = useNavigate();

    const getPlans = async () => {
        try {
            const response = await axios.get('/api/public/plans');  
            setPlans(response.data.plans);           
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    }; 

    useEffect(() => {
        getPlans();
    }, [currency]);


    const handlePurchasePlan = (planId: string) => {
        navigate(`/purchase/${planId}`);
    };

    return (
        <div className="grid grid-cols-12 light:bg-[#f9fafb] w-full min-h-screen py-8 gap-5 mt-32 max-w-7xl mx-auto" id='pricing'>
            <div className="col-span-12 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="sm:text-4xl text-3xl font-lazare font-bold tracking-wide text-foreground/90" >
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-gray-600 text-md font-lazare font-bold sm:text-lg max-w-3xl mt-2">
                        Choose the perfect plan for your platform's needs
                    </p>
                </div>
            </div>



            <div className="col-span-12 flex items-center justify-center px-4 md:px-10 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full font-lazare font-bold">
                    {plans?.map((plan, i) => (
                        i<3 ? ( <div
                            key={i}
                            className={`relative ${i !== 1 ? "mt-0 md:mt-4" : ""}
                                 light:bg-white rounded-xl shadow-md dark:bg-[#1f2b40] hover:shadow-xl transition-all duration-300 p-6 flex flex-col`}
                                >
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                                    <p className="text-gray-500 mt-2">{plan.description}</p>
                                    <div className="flex items-baseline mt-4">
                                        <span className="text-3xl font-bold">{currency.currencySymbol}{plan.price.toLocaleString()}</span>
                                        <span className="text-gray-500 ml-2">/{plan.billingCycle}</span>
                                    </div>
                                    <div className="space-y-4 mt-6">
                                        {plan.features.map((feature: string, index: number) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <FcCheckmark className="flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePurchasePlan(plan._id as string)}
                                    className={`w-full mt-6 h-14 rounded-md transition-all duration-300 ${i === 1
                                        ? "dark:bg-[#38456683] bg-[#1c1e21f3] hover:bg-gray-200 dark:hover:text-white text-white hover:text-black"
                                        : "dark:bg-[#384566c5]  bg-[#1c1e21f3] hover:bg-gray-200 dark:hover:text-white text-white hover:text-black"
                                        }`}
                                >
                                    Purchase Plan
                                </button>
                            </div>):(<></>)
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Plans;
