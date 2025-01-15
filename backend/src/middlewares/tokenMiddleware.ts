import { Request, Response, NextFunction } from "express";
import JwtService from "../services/authentication/jwtService";
import CompanyEntityService from "../services/company/companyService";
import AgencyEntityService from "../services/agency/entityService";
import { CustomError } from "../utils/CustomError";
import AdminService from "../services/admin/adminService";

const jwtService = new JwtService();
const companyEntityService = new CompanyEntityService();
const agencyEntityService = new AgencyEntityService();
const adminService = new AdminService()


declare global {
    namespace Express {
        interface Request {
            details?: any;
        }
    }
}


export const TokenMiddleWare = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token = req.cookies.accessToken ?? null
        let refreshToken = req.cookies.refreshToken ?? null
        

        if (!token && !refreshToken) return res.status(400).json({ success: false })


        if (!token && refreshToken) {
            let isValidRefresh = await jwtService.verifyRefreshToken(refreshToken)

            let newAccessToken = await jwtService.generateAccesstokenWithRefreshToken(isValidRefresh.email, isValidRefresh.role)
            token = newAccessToken

            res.cookie('accessToken', newAccessToken, {
                httpOnly: false,
                secure: false,
                maxAge: 2 * 60 * 1000
            });
        }

        const tokenDetails = await jwtService.decodeAccessToken(token ?? '')
        let ownerDetails
          if (tokenDetails.role == 'Agency') {
            ownerDetails = await agencyEntityService.verifyOwner(tokenDetails.email)
        } else if (tokenDetails.role == 'Company') {
            ownerDetails = await companyEntityService.verifyOwner(tokenDetails.email)
        }else if(tokenDetails.role == 'Admin'){
            ownerDetails = await adminService.getAdmin(tokenDetails.email)
        }

        if (ownerDetails?.isBlocked) throw new CustomError('Account is Blocked', 400)

        req.details = ownerDetails

        next();
    } catch (error) {
        next(error);
    }
}