import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "mern.common";

export const permissionGate = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.details.role !== requiredRole) {
        throw new UnauthorizedError('Unauthorized access');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
