import { Request, Response, NextFunction } from "express";
import { connectTenantDB, getTenantConnection } from "../config/db";


declare global {
    namespace Express {
      export interface Request {
        tenantDb?: any; 
      }
    }
  }

export const TenantMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {

        let path = req.path.slice(1)
        console.log(path);
        if (!getTenantConnection(req.details.orgId) && path != "") {
             const connection = await connectTenantDB(req.details.orgId);
             req.tenantDb = connection
        }else{
          req.tenantDb = getTenantConnection(req.details.orgId)
        } 

        next();
    } catch (error) {
        next(error)
    }
}  