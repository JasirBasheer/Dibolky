import { inject, injectable } from "tsyringe";
import { IManagerService } from "../Interface/IManagerService";
import { IManagerRepository } from "../../repositories/Interface/IManagerRepository";
import { IManagerTenantRepository } from "../../repositories/Interface/IManagerTenantRepository";

@injectable()
export default class ManagerService implements IManagerService {
    private managerRepository: IManagerRepository;
    private managerTenantRepository: IManagerTenantRepository;
    constructor(
        @inject('ManagerRepository') managerRepository: IManagerRepository,
        @inject('ManagerTenantRepository') managerTenantRepository: IManagerTenantRepository
    ) {
        this.managerRepository = managerRepository
        this.managerTenantRepository = managerTenantRepository
    }

}

