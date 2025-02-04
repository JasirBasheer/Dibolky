import express from 'express';
import { container } from 'tsyringe';
import { TenantMiddleWare } from '../../../middlewares/tenant.middleware';
import { IClientController } from '../../../controllers/Interface/IClientController';
import { IProviderController } from '../../../controllers/Interface/IProviderController';
const router = express.Router()

//* Controllers
const clientController = container.resolve<IClientController>('ClientController')
const providerController = container.resolve<IProviderController>('ProviderController')

//* Middlewares
router.use(TenantMiddleWare)

//* Get requests
router.get('/', (req, res, next) =>clientController.getClient(req,res,next))
router.get('/get-client-details', (req, res, next) =>clientController.getClientDetails(req,res,next))
router.get('/connect/:provider',(req, res, next) =>providerController.connectSocialPlatforms(req,res,next))
router.get('/approve-content/:contentId/:clientId', (req, res, next) =>providerController.processContentApproval(req,res,next))
router.get('/get-review-bucket/:clientId', (req, res, next) =>providerController.getReviewBucket(req,res,next))
router.get('/check-username/:provider/:clientId', (req, res, next) =>providerController.getReviewBucket(req,res,next))

//* Post requests
router.post('/save-platform-token/:provider/:clientId',(req, res, next) =>providerController.saveSocialPlatformTokenToDb(req,res,next))
router.post('/save-platform-username/:provider/:clientId',(req, res, next) =>providerController.savePlatformUserNameToDb(req,res,next))


export default router


