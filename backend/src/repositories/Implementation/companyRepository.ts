import mongoose from "mongoose";
import Company from "../../models/company/companyModel"
import { ICompanyOwner } from "../../shared/types/companyTypes";
import { ICompanyRepository } from "../Interface/ICompanyRepository";




export default class CompanyRepository implements ICompanyRepository {

    async findCompanyWithMail(email: string): Promise<ICompanyOwner | null> {
        return await Company.findOne({ email: email })
    }

    async findCompanyWithId(id: string): Promise<ICompanyOwner | null> {
        return await Company.findOne({ _id: id })
    }

    async changePassword(id: string, password: string):Promise<any> {
        return await Company.findOneAndUpdate(
            { _id: id }, 
            { $set: { password: password } }, 
            { new: true }
        )
    }

}
