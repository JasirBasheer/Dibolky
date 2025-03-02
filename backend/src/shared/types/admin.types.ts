import mongoose, { Document } from "mongoose";
import { IMenuCategory, IMenuItems } from "./common.types";



export interface IAdmin extends Document {
    role?:string;
    orgId?:string;
    organizationName?:string;
    name: string;
    email: string;
    password: string;
    isBlocked?: boolean;
}


export interface planDetails {
    _id?:mongoose.ObjectId,
    title: string;
    description: string;
    price: number;
    validity: string,
    features: string[];
    menu: IMenuCategory | string[]
}


export interface IPlan extends Document {
    id?: number;
    title: string;
    price: number;
    features: string[];
    validity: string;
    totalProjects?: number;
    totalManagers?: number;
    menu?: {
        smm?: IMenuItems;
        crm?: IMenuItems;
        accounting?: IMenuItems;
    };
    isActive:boolean;
}



export interface Plans {
    [key: string]: IPlan[]; 
}