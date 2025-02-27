import { NextFunction, Request, Response } from 'express';

export interface IProviderController {
    processContentApproval(req: Request, res: Response, next: NextFunction): Promise<any>
    saveSocialPlatformToken(req:Request,res:Response,next:NextFunction):Promise<void>
    connectSocialPlatforms(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMetaPagesDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
}
