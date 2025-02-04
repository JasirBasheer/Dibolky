import { NextFunction, Request, Response } from 'express';

export interface IProviderController {
    processContentApproval(req: Request, res: Response, next: NextFunction): Promise<any>
    saveSocialPlatformTokenToDb(req:Request,res:Response,next:NextFunction):Promise<void>
    savePlatformUserNameToDb(req: Request, res: Response, next: NextFunction): Promise<void>;
    connectSocialPlatforms(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewBucket(req:Request,res:Response,next:NextFunction):Promise<void>
}
