import { NextFunction, Request, Response } from 'express';

export interface IProviderController {
    approveContent(req: Request, res: Response, next: NextFunction): Promise<any>
    connectSocialPlatforms(req: Request, res: Response, next: NextFunction): Promise<void>;
}
