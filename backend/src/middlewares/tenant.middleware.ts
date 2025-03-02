import { Request, Response, NextFunction } from "express";
import { connectTenantDB, getTenantConnection } from "../config/db";
import { Connection } from "mongoose";
import { NotFoundError } from "mern.common";


declare global {
    namespace Express {
      export interface Request {
        tenantDb?: Connection;
      }
    }
  }

export const TenantMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
       if(!req.details)throw new NotFoundError("Details Not Fount")
        let path = req.path.slice(1)
        if (!getTenantConnection(req.details.orgId as string) && path != "") {
             const connection = await connectTenantDB(req.details.orgId as string);
             req.tenantDb = connection
        }else{
          req.tenantDb = getTenantConnection(req.details.orgId as string)
        } 

        next();
    } catch (error) {
        next(error)
    }
}  