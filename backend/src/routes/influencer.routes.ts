import express from 'express';
import { container } from 'tsyringe';
import { TenantMiddleWare } from '../middlewares/tenant.middleware';
import { IClientController } from '../controllers/Interface/IClientController';
import { permissionGate } from '../middlewares/permissionGate.middleware';
import { IInfluencerController } from '../controllers/Interface/IInfluencerController';
const router = express.Router()

// Controllers
const influencerController = container.resolve<IInfluencerController>('InfluencerController')

// Middlewares
router.use(TenantMiddleWare)
router.use(permissionGate(["influencer"]))


// Get requests
router.get('/', (req, res, next) =>influencerController.getInfluencer(req,res,next))


export default router


