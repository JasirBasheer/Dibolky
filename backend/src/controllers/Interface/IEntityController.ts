import { 
    Request, 
    Response 
} from 'express';

/** Interface for Entity Controller */
export interface IEntityController {


    getMenu(req: Request, res: Response): Promise<void>
    getOwner(req: Request, res: Response): Promise<void>
    getChats(req: Request, res: Response): Promise<void>
    getInbox(req: Request, res: Response): Promise<void>
    getMedia(req: Request, res: Response): Promise<void>

    sendMessage(req: Request, res: Response): Promise<void>
    getInboxMessages(req: Request, res: Response): Promise<void>
    getChat(req: Request, res: Response): Promise<void>
    getMessages(req: Request, res: Response): Promise<void>
    createGroup(req: Request, res: Response): Promise<void>

    getAllProjects(req:Request,res:Response):Promise<void>
    markProjectAsCompleted(req:Request,res:Response):Promise<void>
    initiateS3BatchUpload(req:Request,res:Response):Promise<void>
    getAllInvoices(req:Request,res:Response):Promise<void>
    getAllTransactions(req:Request,res:Response):Promise<void>
    getAllActivities(req:Request,res:Response):Promise<void>
    updateProfile(req:Request,res:Response):Promise<void>
    
    getCalenderEvents(req:Request,res:Response):Promise<void>
    

    getAgoraTokens(req: Request, res: Response): Promise<void>

}