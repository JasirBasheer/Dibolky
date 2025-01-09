import mongoose,{Schema,Document} from "mongoose";

export interface IMainDbEmployee extends Document{
    orgId:string;
    employeeName:string;
    department:string;
    email:string;
    password:string;
}

export interface IEmployee extends Document{
    orgId:string;
    employeeName:string;
    department:string;
    email:string;
    password:string;
}

export const MainDbEmployeeSchema: Schema<IMainDbEmployee> = new mongoose.Schema({
    orgId:{
        type:String,
        required:true
    },
    employeeName:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})




const employeeSchema: Schema<IEmployee> = new mongoose.Schema({
    orgId:{
        type:String,
        required:true
    },
    employeeName:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


export default mongoose.model<IMainDbEmployee>('Employee', MainDbEmployeeSchema);