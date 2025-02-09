import express from 'express';
const router = express.Router()
import { TenantMiddleWare } from '../../middlewares/tenant.middleware';
import { IAgencyController } from '../../controllers/Interface/IAgencyController';
import { container } from 'tsyringe';
import { upload } from '../../config/multer';

// Controllers
const agencyController = container.resolve<IAgencyController>('AgencyController')

// Middlewares
router.use(TenantMiddleWare)

// Get requests
router.get('/', (req, res, next) =>agencyController.getAgency(req,res,next))
router.get('/clients', (req, res, next) =>agencyController.getAllClients(req,res,next))
router.get('/client/:id', (req, res, next) =>agencyController.getClient(req,res,next))

// Post requests
router.post('/client', (req, res, next) =>agencyController.createClient(req,res,next))
router.post('/upload',upload.array('file'),(req,res,next)=> agencyController.uploadContent(req,res,next))


export default router
