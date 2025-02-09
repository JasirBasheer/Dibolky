import { Document } from "mongoose";



export interface IAdmin extends Document{
    name: string;
    email: string;
    password: string;
}

