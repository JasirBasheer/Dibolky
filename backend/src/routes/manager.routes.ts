import express from 'express';
import { container } from 'tsyringe';
import { TenantMiddleWare } from '../middlewares/tenant.middleware';
import { IClientController } from '../controllers/Interface/IClientController';
import { permissionGate } from '../middlewares/permissionGate.middleware';
const router = express.Router()

// Controllers
const clientController = container.resolve<IClientController>('ClientController')

// Middlewares
router.use(TenantMiddleWare)
router.use(permissionGate(["manager"]))


// Get requests
router.get('/', (req, res, next) =>clientController.getClient(req,res,next))
router.get('/owner', (req, res, next) =>clientController.getOwner(req,res,next))


export default router


