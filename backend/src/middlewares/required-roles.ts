import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "mern.common";

export const requireRoles = (
  requiredRoles: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if(!req.details)throw new NotFoundError("Details Not Fount")
        console.log("reshhh",req.details.role)
      if (!requiredRoles.includes(req.details.role as string)) {
        throw new UnauthorizedError('Unauthorized access');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
