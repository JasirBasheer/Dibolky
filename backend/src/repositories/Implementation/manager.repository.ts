import { inject, injectable } from 'tsyringe';
import { Model } from 'mongoose';
import { BaseRepository } from 'mern.common';
import { IManagerRepository } from '../Interface/IManagerRepository';


@injectable()
export default class ManagerRepository extends BaseRepository<any> implements IManagerRepository {
        constructor(
                @inject('manager_model') model: Model<any>
        ) {
                super(model);
        }

}