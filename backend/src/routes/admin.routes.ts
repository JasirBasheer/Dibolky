import express from 'express';
const router = express.Router();
import { IAdminController } from '../controllers/Interface/IAdminController';
import { container } from 'tsyringe';
import { permissionGate } from '../middlewares/permissionGate.middleware';

// Controllers
const adminController = container.resolve<IAdminController>('AdminController')

// Middlewares
router.use(permissionGate("Admin"))

// Get requests
router.get('/', (req, res, next) => adminController.verifyAdmin(req, res, next))
router.get('/clients', (req, res, next) => adminController.recentClients(req, res, next))
router.get('/recent-clients', (req, res, next) => adminController.recentClients(req, res, next))
router.get('/get-client/:role/:id', (req, res, next) => adminController.getClient(req, res, next))

export default router;
