import mongoose, { Document } from "mongoose";



export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
}


export interface planDetails {
    _id?:mongoose.ObjectId,
    title: string;
    description: string;
    price: number;
    validity: string,
    features: string[];
    menu: any
}

interface IMenu {
    smm?:ISubMenu;
    marketing?:ISubMenu;
  }


interface ISubMenu {
    label: string;
    icon: string;
    subItems: IMenuItem[];
}
interface IMenuItem {
    label: string;
    icon: string;
    path: string[];
}