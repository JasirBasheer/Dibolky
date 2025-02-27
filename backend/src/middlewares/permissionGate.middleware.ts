import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "mern.common";

export const permissionGate = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!requiredRoles.includes(req.details.role)) {
        throw new UnauthorizedError('Unauthorized access');
      }
      console.log("permission granted")
      next();
    } catch (error) {
      next(error);
    }
  };
};
