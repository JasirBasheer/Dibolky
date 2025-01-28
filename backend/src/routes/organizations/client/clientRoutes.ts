import express from 'express';
import { container } from 'tsyringe';
import { TenantMiddleWare } from '../../../middlewares/tenant.middleware';
import { IClientController } from '../../../controllers/Interface/IClientController';
const router = express.Router()


const clientController = container.resolve<IClientController>('ClientController')

router.use(TenantMiddleWare)
router.get('/', (req, res, next) =>clientController.getClient(req,res,next))


export default router