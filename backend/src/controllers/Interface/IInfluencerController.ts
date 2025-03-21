import {
    NextFunction,
    Request,
    Response
} from 'express';

/** Interface for Influencer Controller */
export interface IInfluencerController {
    getInfluencer(req: Request, res: Response, next: NextFunction): Promise<void>
}