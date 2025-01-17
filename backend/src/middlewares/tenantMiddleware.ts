import { Request, Response, NextFunction } from "express";
import { connectTenantDB } from "../config/db";
import { clientSchema } from "../models/agency/clientModel";



declare global {
    namespace Express {
        interface Request {
            db?: any;
            clientModel?: any;
        }
    }
}




export const TenantMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let path = req.path.slice(1)
        if (!req.db && path != "") {
            const db = await connectTenantDB(req.details.orgId);
            const ClientModel = db.model('client', clientSchema)
            req.db = db;
            req.clientModel = ClientModel
            console.log("Done");
        } else {
            console.log("Already connected");
        }

        next();

    } catch (error) {
        next(error)
    }
}  