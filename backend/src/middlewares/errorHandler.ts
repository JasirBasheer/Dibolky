import { NextFunction, Request, Response } from "express";
import { BaseError } from "mern.common"; 
import logger from "../logger";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error(`${err.message} ${err.stack}`,{
         path:req.originalUrl, 
         method:req.method, 
         message:err.message, 
         status:res.statusCode || 500
        })

    if (err.message === "Invalid Token") {
        res.clearCookie('accessToken', { httpOnly: true, secure: false });
        res.clearCookie('refreshToken', { httpOnly: false, secure: false });
    }

    if (err instanceof BaseError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({
            message: err.message || "Something went wrong",
        });
    }
};