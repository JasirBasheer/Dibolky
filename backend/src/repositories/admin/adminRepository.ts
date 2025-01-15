import { AgencyPlan, CompanyPlan } from '../../models/admin/planModel'
import Admin from '../../models/admin/adminModel'
import Agency from '../../models/agency/agencyModel'
import Company from '../../models/company/companyModel'


class AdminRepository {
        async getAdmin(email: string) {
                return await Admin.findOne({ email: email })
        }
        async getAllCompanyOwners() {
                return await Company.find()
        }
        async getAllAgencyOwners() {
                return await Agency.find()
        }

        async changePassword(id: string, password: string) {
                try {
                        
                        return await Admin.findOneAndUpdate({ _id: id }, { $set: { password: password } }, { new: true })
                } catch (error) {
                        throw error
                }
        }
}

export default AdminRepository