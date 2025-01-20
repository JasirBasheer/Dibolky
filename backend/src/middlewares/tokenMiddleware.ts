import { Request, Response, NextFunction } from "express";
import { generateToken, UnauthorizedError, verifyToken } from "mern.common";
import { container } from "tsyringe";
import { ICompanyService } from "../services/Interface/ICompanyService";
import { IAgencyService } from "../services/Interface/IAgencyService";
import { IAdminService } from "../services/Interface/IAdminService";

const companyService = container.resolve<ICompanyService>("CompanyService");
const agencyService = container.resolve<IAgencyService>("AgencyService");
const adminService = container.resolve<IAdminService>("AdminService");

declare global {
    namespace Express {
        interface Request {
            details?: any;
        }
    }
}

interface GeoData {
    country: string;
    currency: string;
    city: string;
    timezone: string;
    countryCode: string;
}

// Extend Express Request type to include geoData
declare global {
    namespace Express {
        interface Request {
            geoData?: GeoData;
        }
    }
}


export const TokenMiddleWare = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token = req.cookies.accessToken ?? null
        let refreshToken = req.cookies.refreshToken ?? null

       
        
        let refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret';
        let accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret';
        

        if (!token && !refreshToken) return res.status(400).json({ success: false })


        if (!token && refreshToken) {
            let isValidRefresh = await verifyToken(refreshTokenSecret,refreshToken)

            let newAccessToken = await generateToken(accessTokenSecret,{email:isValidRefresh.email, role:isValidRefresh.role})
            token = newAccessToken

            res.cookie('accessToken', newAccessToken, {
                httpOnly: false,
                secure: false,
                maxAge: 2 * 60 * 1000
            });
        }

        const tokenDetails = await verifyToken(accessTokenSecret,token ?? '')
        let ownerDetails
        if (tokenDetails.role == 'Agency') {
            ownerDetails = await agencyService.verifyOwner(tokenDetails.email)
        } else if (tokenDetails.role == 'Company') {
            ownerDetails = await companyService.verifyOwner(tokenDetails.email)
        } else if (tokenDetails.role == 'Admin') {
            ownerDetails = await adminService.verifyAdmin(tokenDetails.email)
        }

        if (ownerDetails?.isBlocked) throw new UnauthorizedError('Account is Blocked')

        req.details = ownerDetails

        next();
    } catch (error) {
        next(error);
    }
}