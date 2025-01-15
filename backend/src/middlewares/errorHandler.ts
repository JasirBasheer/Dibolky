import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error:', err.message || err);

    const statusCode = err.status || 500; 
    const message = err.message || 'Internal Server Error';
    if(message == "Invalid Token"){      
    res.clearCookie('accessToken', {httpOnly: true,secure: false,});
    res.clearCookie('refreshToken', {httpOnly: false,secure: false});
    }



    res.status(statusCode).json({
        success: false,
        message,
    });
};
