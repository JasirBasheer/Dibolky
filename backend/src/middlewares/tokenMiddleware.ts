import { Request, Response, NextFunction } from "express";
import { CustomError } from "../shared/utils/CustomError";
import { decodeAccessToken, generateAccesstoken, verifyRefreshToken } from "../shared/utils/jwtUtils";
import { container } from "tsyringe";
import { ICompanyService } from "../services/Interface/ICompanyService";
import { IAgencyService } from "../services/Interface/IAgencyService";
import { IAdminService } from "../services/Interface/IAdminService";

const companyService = container.resolve("ICompanyService") as ICompanyService;
const agencyService = container.resolve("IAgencyService") as IAgencyService;
const adminService = container.resolve("IAdminService") as IAdminService;

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
            let isValidRefresh = await verifyRefreshToken(refreshToken)

            let newAccessToken = await generateAccesstoken(isValidRefresh.email, isValidRefresh.role)
            token = newAccessToken

            res.cookie('accessToken', newAccessToken, {
                httpOnly: false,
                secure: false,
                maxAge: 2 * 60 * 1000
            });
        }

        const tokenDetails = await decodeAccessToken(token ?? '')
        let ownerDetails
          if (tokenDetails.role == 'Agency') {
            ownerDetails = await agencyService.verifyOwner(tokenDetails.email)
        } else if (tokenDetails.role == 'Company') {
            ownerDetails = await companyService.verifyOwner(tokenDetails.email)
        }else if(tokenDetails.role == 'Admin'){
            ownerDetails = await adminService.verifyAdmin(tokenDetails.email)
        }

        if (ownerDetails?.isBlocked) throw new CustomError('Account is Blocked', 400)

        req.details = ownerDetails

        next();
    } catch (error) {
        next(error);
    }
}