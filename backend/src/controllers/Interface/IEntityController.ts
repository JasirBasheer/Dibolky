import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

/** Interface for Entity Controller */
export interface IEntityController {
    checkMail(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>
    getPlan(req: Request, res: Response, next: NextFunction ): Promise<void>
    registerAgency(req: Request, res: Response, next: NextFunction): Promise<void>
    createInfluencer(req: Request, res: Response, next: NextFunction): Promise<void>
    getMenu(req: Request, res: Response, next: NextFunction): Promise<void>
    getCountry(req: Request, res: Response, next: NextFunction): Promise<void>
    getOwner(req: Request, res: Response, next: NextFunction): Promise<void>
    getChats(req: Request, res: Response, next: NextFunction): Promise<void>
    getChat(req: Request, res: Response, next: NextFunction): Promise<void>
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>
    createGroup(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllProjects(req:Request,res:Response,next:NextFunction):Promise<void>
    initiateS3BatchUpload(req:Request,res:Response,next:NextFunction):Promise<void>
    saveContent(req:Request,res:Response,next:NextFunction):Promise<void>
    getS3ViewUrl(req:Request,res:Response,next:NextFunction):Promise<void>
    fetchContents(req:Request,res:Response,next:NextFunction):Promise<void>
    fetchAllScheduledContents(req:Request,res:Response,next:NextFunction):Promise<void>
    getUploadS3Url(req:Request,res:Response,next:NextFunction):Promise<void>
    updateProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    getConnections(req:Request,res:Response,next:NextFunction):Promise<void>
}