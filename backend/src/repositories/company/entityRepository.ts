import Company from "../../models/company/companyModel"

class CompanyEntityController {

    async findOwner(email: string): Promise<any> {
        try {
            return await Company.findOne({ email: email })
        } catch (error) {
            throw error
        }
    }


    async changePassword(id: string, password: string) {
        try {
            return await Company.findOneAndUpdate({ _id: id }, { $set: { password: password } }, { new: true })
        } catch (error) {
            throw error
        }
    }

}
export default CompanyEntityController
