import express from 'express';
const router = express.Router()
import { TenantMiddleWare } from '../../middlewares/tenant.middleware';
import { IAgencyController } from '../../controllers/Interface/IAgencyController';
import { container } from 'tsyringe';
import { upload } from '../../config/multer';
import { permissionGate } from '../../middlewares/permissionGate.middleware';

// Controllers
const agencyController = container.resolve<IAgencyController>('AgencyController')

// Middlewares
router.use(TenantMiddleWare)
router.use(permissionGate(["agency"]))


// Get requests
router.get('/', (req, res, next) =>agencyController.getAgency(req,res,next))
router.get('/owner-details', (req, res, next) =>agencyController.getAgencyOwnerDetails(req,res,next))
router.get('/availabe-users', (req, res, next) =>agencyController.getAvailableUsers(req,res,next))
router.get('/clients', (req, res, next) =>agencyController.getAllClients(req,res,next))
router.get('/client/:id', (req, res, next) =>agencyController.getClient(req,res,next))
router.get('/projects-count', (req, res, next) =>agencyController.getProjectsCount(req,res,next))
router.get('/clients-count', (req, res, next) =>agencyController.getClientsCount(req,res,next))
router.get('/get-initial-set-up', (req, res, next) =>agencyController.getInitialSetUp(req,res,next))
// Patch requests
router.patch('/edit-project-status', (req, res, next) =>agencyController.editProjectStatus(req,res,next))



// Post requests
router.post('/client', (req, res, next) =>agencyController.createClient(req,res,next))
router.post('/upload',(req,res,next)=> agencyController.uploadContent(req,res,next))


export default router
