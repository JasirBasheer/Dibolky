import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "mern.common";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);     

      if (!result.success) {
        const firstError = result.error.issues[0];
        const path = firstError.path.join(".");
        return next(new CustomError(`${path} : ${firstError.message}`, 400));
      }
      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
