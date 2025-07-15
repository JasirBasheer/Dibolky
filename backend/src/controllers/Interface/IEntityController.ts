import { 
    Request, 
    Response 
} from 'express';

/** Interface for Entity Controller */
export interface IEntityController {
    checkMail(req: Request, res: Response): Promise<void>
    createAgency(req: Request, res: Response): Promise<void>
    getMenu(req: Request, res: Response): Promise<void>
    getCountry(req: Request, res: Response): Promise<void>
    getOwner(req: Request, res: Response): Promise<void>
    getChats(req: Request, res: Response): Promise<void>
    getInbox(req: Request, res: Response): Promise<void>
    getChat(req: Request, res: Response): Promise<void>
    getMessages(req: Request, res: Response): Promise<void>
    createGroup(req: Request, res: Response): Promise<void>
    getAllProjects(req:Request,res:Response):Promise<void>
    initiateS3BatchUpload(req:Request,res:Response):Promise<void>
    saveContent(req:Request,res:Response):Promise<void>
    getS3ViewUrl(req:Request,res:Response):Promise<void>
    fetchContents(req:Request,res:Response):Promise<void>
    fetchAllScheduledContents(req:Request,res:Response):Promise<void>
    getUploadS3Url(req:Request,res:Response):Promise<void>
    updateProfile(req:Request,res:Response):Promise<void>
    getConnections(req:Request,res:Response):Promise<void>
    handleLinkedinCallback(req:Request,res:Response):Promise<void>
    handleXCallback(req:Request,res:Response):Promise<void>
    
}