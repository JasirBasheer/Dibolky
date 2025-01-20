import express from 'express';
const router = express.Router()
import { TenantMiddleWare } from '../../../middlewares/tenantMiddleware';
import { IAgencyController } from '../../../controllers/Interface/IAgencyController';
import { container } from 'tsyringe';

const agencyController = container.resolve<IAgencyController>('AgencyController')

router.use(TenantMiddleWare)
router.get('/', (req, res, next) =>agencyController.getAgency(req,res,next))
router.post('/client', (req, res, next) =>agencyController.createClient(req,res,next))

export default router