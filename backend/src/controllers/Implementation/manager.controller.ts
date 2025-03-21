import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IManagerService } from "../../services/Interface/IManagerService";
import { IManagerController } from "../Interface/IManagerController";





@injectable()
export default class ManagerController implements IManagerController {
    private managerService: IManagerService;

    constructor(
        @inject('ManagerService') managerService: IManagerService,
    ) {
        this.managerService = managerService
    }

}

