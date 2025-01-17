import React, { useEffect, useState } from 'react';
import { FcCheckmark } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Plans = () => {
    const [plans, setPlans] = useState<any>(null); 
    const [isAgency, setIsAgency] = useState(true); 
    const [sortedPlans, setSortedPlans] = useState<any[]>([]); 
    const navigate = useNavigate();

    const getPlans = async () => {
        try {
            const response = await axios.get('/api/entities/get-all-plans');
            setPlans(response.data.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    useEffect(() => {
        getPlans();
    }, []);

    useEffect(() => {
        if (plans) {
            setSortedPlans(plans[isAgency ? 'Agency' : 'Company'] || []); 
        }
    }, [isAgency, plans]); 

    const handlePurchasePlan = (planId: any) => {
        let platform = isAgency ? "Agency" : "Company";
        navigate(`/purchase/${platform}/${planId}`);
    };



    return (
        <div className="grid grid-cols-12 bg-[#f9fafb] w-full min-h-screen py-8 gap-5">
            <div className="col-span-12 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="sm:text-4xl text-3xl font-semibold tracking-wide">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-gray-600 text-md sm:text-lg max-w-3xl mt-2">
                        Choose the perfect plan for your platform's needs
                    </p>
                </div>
            </div>

            <div className="col-span-12 flex items-center justify-center">
                <div className="relative bg-white px-2 py-2 rounded-lg shadow-md">
                    <div className="flex relative">
                        <button
                            className={`relative z-10 transition-colors duration-300 md:w-44 w-36 h-9 rounded-md ${isAgency ? "text-white" : "text-gray-700"
                                }`}
                            onClick={() => setIsAgency(true)}
                        >
                            Agency
                        </button>
                        <button
                            className={`relative z-10 transition-colors duration-300 md:w-44 w-36 h-9 rounded-md ${!isAgency ? "text-white" : "text-gray-700"
                                }`}
                            onClick={() => setIsAgency(false)}
                        >
                            Company
                        </button>
                        <div
                            className={`absolute top-0 h-9 w-36 md:w-44 bg-blue-600 rounded-md transition-all duration-300 ${isAgency ? "left-0" : "left-[144px] md:left-44"
                                }`}
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-12 flex items-center justify-center px-4 md:px-10 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full">
                    {sortedPlans.map((plan, i) => (
                        i<3 ? ( <div
                            key={plan.id}
                            className={`relative ${i !== 1 ? "mt-0 md:mt-4" : ""}
                                 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col`}
                                >
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold">{plan.title}</h2>
                                    <p className="text-gray-500 mt-2">{plan.description}</p>
                                    <div className="flex items-baseline mt-4">
                                        <span className="text-3xl font-bold">${plan.price}</span>
                                        <span className="text-gray-500 ml-2">/{plan.validity}</span>
                                    </div>
                                    <div className="space-y-4 mt-6">
                                        {plan.features.map((feature: any, index: any) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <FcCheckmark className="flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePurchasePlan(plan._id)}
                                    className={`w-full mt-6 h-14 rounded-md transition-all duration-300 ${i === 1
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-100 hover:bg-gray-200"
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
