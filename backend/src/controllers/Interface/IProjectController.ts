import { Request, Response } from "express";

export interface IProjectController {
    getAllProjects(req:Request,res:Response):Promise<void>
    markProjectAsCompleted(req:Request,res:Response):Promise<void>
}
