import {
    Request,
    Response
} from 'express';

/** Interface for Influencer Controller */
export interface IInfluencerController {
    getInfluencer(req: Request, res: Response): Promise<void>
}