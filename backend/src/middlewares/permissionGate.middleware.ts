import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "mern.common";

export const permissionGate = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.details.role)
      if (!requiredRoles.includes(req.details.role)) {
        throw new UnauthorizedError('Unauthorized access');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
