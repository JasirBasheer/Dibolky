import express from 'express';
import { container } from 'tsyringe';
import { TenantMiddleWare } from '../../middlewares/tenant.middleware';
import { IClientController } from '../../controllers/Interface/IClientController';
import { IProviderController } from '../../controllers/Interface/IProviderController';
import { permissionGate } from '../../middlewares/permissionGate.middleware';
const router = express.Router()

// Controllers
const clientController = container.resolve<IClientController>('ClientController')
const providerController = container.resolve<IProviderController>('ProviderController')

// Middlewares
router.use(TenantMiddleWare)
router.use(permissionGate(["Client","agency"]))


// Get requests
router.get('/', (req, res, next) =>clientController.getClient(req,res,next))
router.get('/owner', (req, res, next) =>clientController.getOwner(req,res,next))
router.get('/get-client-details', (req, res, next) =>clientController.getClientDetails(req,res,next))
router.get('/check-username/:provider/:clientId', (req, res, next) =>providerController.getReviewBucket(req,res,next))
// router.get('/connect/:provider',(req, res, next) =>providerController.connectSocialPlatforms(req,res,next))


export default router


