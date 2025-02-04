import { Request, Response, NextFunction } from 'express';
import { BaseError } from 'mern.common/dist/errors/error.base';
import logError from '../shared/utils/logger';

export const errorHandler = (err: any,req: Request,res: Response,next: NextFunction): void => {
    logError(err.message || err)

    if (err.message === "Invalid Token") {
        res.clearCookie('accessToken', { httpOnly: true, secure: false });
        res.clearCookie('refreshToken', { httpOnly: false, secure: false });
    }

    if (err instanceof BaseError) {
        console.log(err);
        res.status(err.statusCode).json({ error:err.message });
    } else {
        res.status(500).json({
            message: err.message || "Something went wrong",
        });
    }
};
