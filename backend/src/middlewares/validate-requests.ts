import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "mern.common";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      
      const result = schema.safeParse(req.body);     


      if (!result.success) {
        const firstError = result.error.issues[0];
        return next(new CustomError(firstError.message, 400));
      }
      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
