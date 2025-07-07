import { Request, Response, NextFunction } from "express";
import { generateToken, NotFoundError, UnauthorizedError, verifyToken } from "mern.common";
import { container } from "tsyringe"; // Keep container import at top
import { IAgencyService } from "../services/Interface/IAgencyService";
import { IAdminService } from "../services/Interface/IAdminService";
import { IClientService } from "../services/Interface/IClientService";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/env.config";
import { isTokenBlacklisted } from "../config/redis.config";
import { IClient } from "../types/client";
import { IAgency } from "../types/agency";
import { IAdmin } from "../types/admin";
import { ITokenDetails } from "../types/common";
import { ROLES } from "../utils/constants.utils";
import { IInfluencerService } from "../services/Interface/IInfluencerService";
import { IEntityService } from "../services/Interface/IEntityService";

declare global {
    namespace Express {
        interface Request {
            details?: IAdmin | IAgency | IClient | null;
            tokenDetails?: ITokenDetails;
            permissions?:string[]
        }
    }
}

export const TokenMiddleWare = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const agencyService = container.resolve<IAgencyService>("AgencyService");
        const adminService = container.resolve<IAdminService>("AdminService");
        const clientService = container.resolve<IClientService>("ClientService");
        const influencerService = container.resolve<IInfluencerService>("InfluencerService");
        const entityService = container.resolve<IEntityService>("EntityService");

        let token = req.cookies.accessToken ?? null
        let refreshToken = req.cookies.refreshToken ?? null

        const isTokenBlaclisted = await isTokenBlacklisted(token)
        if (isTokenBlaclisted) {
            res.clearCookie('accessToken')
            throw new UnauthorizedError('Token blacklisted please login to continue')
        }

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
        switch (tokenDetails.role) {
            case ROLES.ADMIN:
                ownerDetails = await adminService.verifyAdmin(tokenDetails.id)
            break;
            case ROLES.AGENCY:
                ownerDetails = await agencyService.verifyOwner(tokenDetails.id)
            break;
            case ROLES.CLIENT:
                ownerDetails = await clientService.verifyClient(tokenDetails.id)
            break;
            case ROLES.INFLUENCER:
                ownerDetails = await influencerService.verifyInfluencer(tokenDetails.id)
            break;
            case ROLES.MANAGER:
                ownerDetails = await clientService.verifyClient(tokenDetails.id)
            break;
            default:
                throw new NotFoundError("Role not found, try again later..")
        }       

        if (ownerDetails?.isBlocked) throw new UnauthorizedError('Account is Blocked')
        const planId = ownerDetails && "planId" in ownerDetails ? ownerDetails.planId : null;
        const plan = await entityService.getPlan(planId ?? "") 
        
        ownerDetails = ownerDetails?.toObject();
        ownerDetails.role = tokenDetails.role
        req.details = ownerDetails
        req.permissions = plan?.permissions ?? [] as string[]
        req.tokenDetails = tokenDetails as ITokenDetails

        next();
    } catch (error) {
        next(error);
    }
}