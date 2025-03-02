import { LucideProps } from "lucide-react";
import { ComponentType, ReactNode } from "react";
import { IPlan } from "./admin.types";

export interface Plan {
    _id: string;
    id: number;
    title: string;
    description: string;
    price: number;
    validity: string;
    features: string[];
}
  

export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    organizationName: string;
    website: string;
    city: string;
    country: string;
    industry: string;
    validity:number;
}

export interface IStripeDetails extends FormData{
    name:string;
    plan:IPlan;
    platform:string;
    amount:number;
    currency:string;
    description:string;
}
export interface ValidationError {
    [key: string]: string;
}


export interface InputFieldProps {
    icon: ReactNode | ComponentType<LucideProps>; 
    name: keyof FormData;
    label: string;
    type?: string;
    required?: boolean;
    pattern?: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
}

export interface FormContextType {
    formData: IFormData;
    errors: ValidationErrors;
    setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
}

export interface IFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    organizationName: string;
    website: string;
    city: string;
    country: string;
    industry: string;
    validity:number;
}

export type ValidationErrors = {
    [K in keyof IFormData]?: string;
}

export interface InputFieldProps {
    icon: ReactNode | ComponentType<LucideProps>; 
    name: keyof IFormData;
    label: string;
    type?: string;
    required?: boolean;
    minLength?: number;
    pattern?: string;
}