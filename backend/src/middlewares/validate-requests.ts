import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "mern.common";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      console.log('RM-LOG', 'Vlidate result', result);
      

      if (!result.success) {
        const firstError = result.error[0];
        const message = `${firstError.message}`;
        return next(new CustomError(message,500));
      }

      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
