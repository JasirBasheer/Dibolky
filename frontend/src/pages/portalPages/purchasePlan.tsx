import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Building2, MapPin, Globe, Lock, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/portalComponents/Navbar';
import axios from '../../utils/axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { message } from "antd";
import { FormData, Plan, ValidationError } from '../../types/portalTypes';
import { renderInputField } from '../../components/portalComponents/Input';
import { handleRazorpayPayment } from '../../helpers/portalHelpers/razporpay';

const PurchasePlan: React.FC = () => {
    const { id, platform } = useParams();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>("razorpay")
    const [errors, setErrors] = useState<ValidationError>({});
    const [loading, setLoading] = useState(true)
    const [next, setNext] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormData>({
        firstName: '', lastName: '', email: '', password: '',
        phone: '', organizationName: '', website: '',
        city: '', country: '', industry: '', validity: 1
    });

    if (!id || !platform) {
        console.error("Missing URL parameters!");
        navigate('/');
        return
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const isnext = validate()
        setNext(isnext)
    }, [formData, currentStep])

    const validate = (): boolean => {
        let ctr = 0
        const set1 = { firstName: '', lastName: '', email: '', password: '', phone: '' }
        const set2 = { organizationName: '', city: '', industry: '', country: '' }
        const currentSet = currentStep === 1 ? set1 : set2;

        for (const key in currentSet) {
            if (errors[key] === '') ctr++;
        }
        return ctr === Object.keys(currentSet).length
    }

    const validateMail = async (Mail: string): Promise<boolean> => {
        const response = await axios.post('/api/entities/check-mail', { Mail, platform })
        return response.data.isExists
    }

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (next) {
            const isExists = await validateMail(formData.email)
            if (isExists && currentStep == 1) {
                message.error('Email alredy exists')
            } else {
                setCurrentStep((prev) => prev + 1)
            }
        }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setLoading(true);
        axios.post(`/api/entities/get-plan`, { id, platform })
            .then((response) => setPlan(response.data.plan))
            .catch((err) => console.error("Error fetching plan:", err))
            .finally(() => setLoading(false))
    }, [id, platform])




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (paymentMethod == 'razorpay') {
            await handleRazorpayPayment(formData, plan, platform, navigate);
        } else if (paymentMethod == 'stripe') {
            alert('Stripe is currently unavailable ,We are working on progress')
        }
    };

    const renderStepIndicator = (): JSX.Element => (
        <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${currentStep === step ? 'bg-blue-600 text-white' :
                                currentStep > step ? 'bg-green-500 text-white' :
                                    'bg-gray-200 text-gray-600'}
                            transition-colors duration-200
                        `}>
                            {currentStep > step ? <Check className="w-5 h-5" /> : step}
                        </div>
                        {step < 3 && (
                            <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );


    const renderStep = (): JSX.Element | null => {
        if (!plan) return null;
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="text-center border-b pb-6">
                            <h2 className="text-3xl font-bold text-gray-900">{plan?.title}
                            </h2>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-blue-600">${plan.price}</span>
                                <span className="text-gray-600 ml-2">/ {plan.validity}</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <p className="text-gray-600 text-center mb-6">{plan.description}</p>
                            <div className="space-y-4">
                                {plan.features?.map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInputField({ icon: User, name: "firstName", label: "First Name", required: true }, { formData, errors, setFormData, setErrors })}
                            {renderInputField({ icon: User, name: "lastName", label: "Last Name", required: true }, { formData, errors, setFormData, setErrors })}
                        </div>
                        {renderInputField({ icon: Mail, name: "email", label: "Email", type: "email", required: true }, { formData, errors, setFormData, setErrors })}
                        {renderInputField({ icon: Lock, name: "password", label: "Password", type: "password", minLength: 8, required: true }, { formData, errors, setFormData, setErrors })}
                        {renderInputField({ icon: Phone, name: "phone", label: "Phone Number", type: "tel", pattern: "[0-9]{10}", required: true }, { formData, errors, setFormData, setErrors })}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Organization Information</h3>
                        {renderInputField({ icon: Building2, name: "organizationName", label: "Organization Name", required: true }, { formData, errors, setFormData, setErrors })}
                        {renderInputField({ icon: Globe, name: "website", label: "Website", type: "url" }, { formData, errors, setFormData, setErrors })}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInputField({ icon: MapPin, name: "city", label: "City", required: true }, { formData, errors, setFormData, setErrors })}
                            {renderInputField({ icon: MapPin, name: "country", label: "Country", required: true }, { formData, errors, setFormData, setErrors })}
                            {renderInputField({ icon: Building2, name: "industry", label: "Industry", required: true }, { formData, errors, setFormData, setErrors })}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fadeIn p-6">
                        <div className="flex w-full justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">Payment Information</h3>
                            <div className="">
                                <select
                                    name="Month"
                                    id="month-select"
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-1 px-2 outline-none cursor-pointer w-full"
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        const validValues = [1, 5, 8, 12];
                                        if (validValues.includes(value)) {
                                          setFormData((prev) => ({
                                            ...prev,
                                            validity: value,
                                          }));
                                        }
                                      }}>
                                    <option value="1">1 Month</option>
                                    <option value="5">5 Months</option>
                                    <option value="8">8 Months</option>
                                    <option value="12">12 Months</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Amount</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-gray-900">₹{plan?.price * (formData?.validity ?? 1) || 0}</span>
                                    <span className="text-gray-500 text-sm ml-1">/ {plan?.validity}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
                            <label className="relative flex p-4 cursor-pointer border rounded-lg hover:border-blue-500 transition-all" onClick={() => setPaymentMethod('razorpay')}>
                                <input
                                    checked
                                    type="radio"
                                    name="payment-method"
                                    value="razorpay"
                                    className="peer sr-only"
                                />
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <img
                                            src="https://razorpay.com/favicon.png"
                                            alt="Razorpay"
                                            className="w-8 h-8"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-gray-900">Razorpay</h4>
                                        <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                                    </div>
                                </div>
                                {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-50">
                                    <Check className="w-4 h-4 text-blue-500 opacity-0 peer-checked:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div> */}
                                <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-blue-500"></div>
                            </label>
                            <label className="relative flex p-4 cursor-pointer border rounded-lg hover:border-blue-500 transition-all" onClick={() => setPaymentMethod('stripe')}>
                                <input
                                    type="radio"
                                    name="payment-method"
                                    value="stripe"
                                    className="peer sr-only"
                                />
                                <div className="flex items-center gap-4 w-full" >
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <img
                                            src="https://stripe.com/favicon.ico"
                                            alt="Stripe"
                                            className="w-8 h-8"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-gray-900">Stripe</h4>
                                        <p className="text-sm text-gray-500">Pay securely with Stripe</p>
                                    </div>
                                </div>
                                {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-50">
                                    <Check className="w-4 h-4 text-blue-500 opacity-0 peer-checked:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div> */}
                                <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-blue-500"></div>
                            </label>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    return (
        <>
            <Navbar animation={false} />
            {loading ? (
                <div className="animate-pulse flex items-center py-12 justify-center">
                    <div className="hidden md:block">
                        <Skeleton width={760} height={500} />
                    </div>
                    <div className="block md:hidden">
                        <Skeleton width={360} height={500} />
                    </div>
                </div>

            ) : (
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg px-8 py-10 mb-8">
                            {currentStep === 0 ? (
                                <>
                                    {renderStep()}
                                    <div className="flex justify-end mt-8">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg
                                              hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                                        >
                                            Get Started
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Complete Your Purchase</h2>
                                    <p className="text-center text-gray-600 mb-8">Please fill in your details to continue</p>
                                    {renderStepIndicator()}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {renderStep()}
                                        <div className="flex justify-between mt-8">
                                            {currentStep > 1 && (
                                                <div
                                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                                    className="px-6 py-2 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200"
                                                >
                                                    Back
                                                </div>
                                            )}

                                            {currentStep < 3 ? (
                                                <button
                                                    onClick={event => { handleNext(event) }} disabled={!next}
                                                    className={`ml-auto flex items-center px-6 py-3 ${next ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400'} text-white rounded-lg transition-colors duration-200 ${!next ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                                    Continue
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="ml-auto flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                                >
                                                    Complete Purchase
                                                    <Check className="ml-2 w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div >
            )}
        </>
    );
};

export default PurchasePlan;