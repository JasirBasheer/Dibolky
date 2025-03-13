import { Request, Response, NextFunction } from "express";
import { generateToken, UnauthorizedError, verifyToken } from "mern.common";
import { container } from "tsyringe";
import { IAgencyService } from "../services/Interface/IAgencyService";
import { IAdminService } from "../services/Interface/IAdminService";
import { IClientService } from "../services/Interface/IClientService";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/env.config";
import { isTokenBlacklisted } from "../config/redis.config";
import { IClient } from "../types/client.types";
import { IAgency } from "../types/agency.types";
import { IAdmin } from "../types/admin.types";
import { ITokenDetails } from "../types/common.types";

// services
const agencyService = container.resolve<IAgencyService>("AgencyService");
const adminService = container.resolve<IAdminService>("AdminService");
const clientService = container.resolve<IClientService>("ClientService");

declare global {
    namespace Express {
        interface Request {
            details?: IAdmin | IAgency | IClient | null;
            tokenDetails?: ITokenDetails;
        }
    }
}



export const TokenMiddleWare = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        let token = req.cookies.accessToken ?? null
        let refreshToken = req.cookies.refreshToken ?? null

        let refreshTokenSecret = JWT_REFRESH_SECRET || 'defaultRefreshSecret';
        let accessTokenSecret = JWT_ACCESS_SECRET || 'defaultAccessSecret';
        if (!token && !refreshToken) throw new UnauthorizedError('Access Denied')


        if (!token && refreshToken) {
            let isValidRefresh = await verifyToken(refreshTokenSecret, refreshToken)
            let newAccessToken = await generateToken(accessTokenSecret, { id: isValidRefresh.id, role: isValidRefresh.role })
            token = newAccessToken

            res.cookie('accessToken', newAccessToken, {
                httpOnly: false,
                secure: false,
                maxAge: 2 * 60 * 1000
            });
        }

        const tokenDetails = await verifyToken(accessTokenSecret, token ?? '')

        let ownerDetails
        if (tokenDetails.role == 'agency') {
            ownerDetails = await agencyService.verifyOwner(tokenDetails.id)
        } else if (tokenDetails.role == 'Admin') {
            ownerDetails = await adminService.verifyAdmin(tokenDetails.id)
        } else if (tokenDetails.role == "Client") {
            ownerDetails = await clientService.verifyClient(tokenDetails.id)
        }else{
            ownerDetails = await clientService.verifyClient(tokenDetails.id)
        }
        

        if (ownerDetails?.isBlocked) throw new UnauthorizedError('Account is Blocked')
        const isTokenBlaclisted = await isTokenBlacklisted(token)
        if (isTokenBlaclisted) {
            res.clearCookie('accessToken')
            throw new UnauthorizedError('Token blacklisted please login to continue')
        }
        ownerDetails = ownerDetails?.toObject();
        ownerDetails.role = tokenDetails.role
        req.details = ownerDetails
        req.tokenDetails = tokenDetails as ITokenDetails

        next();
    } catch (error) {
        next(error);
    }
}