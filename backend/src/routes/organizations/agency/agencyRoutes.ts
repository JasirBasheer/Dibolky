import express from 'express';
const router = express.Router()
import { TenantMiddleWare } from '../../../middlewares/tenant.middleware';
import { IAgencyController } from '../../../controllers/Interface/IAgencyController';
import { container } from 'tsyringe';
import { upload } from '../../../config/multer';
import { IProviderController } from '../../../controllers/Interface/IProviderController';

const agencyController = container.resolve<IAgencyController>('AgencyController')
const providerController = container.resolve<IProviderController>('ProviderController')

router.use(TenantMiddleWare)
router.get('/', (req, res, next) =>agencyController.getAgency(req,res,next))
router.get('/clients', (req, res, next) =>agencyController.getAllClients(req,res,next))
router.get('/client/:id', (req, res, next) =>agencyController.getClient(req,res,next))
router.post('/client', (req, res, next) =>agencyController.createClient(req,res,next))

router.get('/connect/:Provider',(req, res, next) =>providerController.connectSocialPlatforms(req,res,next))
router.post('/savePlatFormToken/:provider/:clientId',(req, res, next) =>agencyController.saveSocialPlatformTokenToDb(req,res,next))
router.get('/client/connect/:provider',(req, res, next) =>agencyController.connectSocialPlatforms(req,res,next))
router.post('/upload',upload.single('file'),(req,res,next)=> agencyController.uploadContent(req,res,next))
router.get('/get-review-bucket/:clientId', (req, res, next) =>agencyController.getReviewBucket(req,res,next))
router.get('/approve-content/:contentId/:clientId', (req, res, next) =>providerController.approveContent(req,res,next))


export default router
