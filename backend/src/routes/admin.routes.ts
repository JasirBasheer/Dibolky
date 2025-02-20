// import express from 'express';
// const router = express.Router();
// import { IAdminController } from '../controllers/Interface/IAdminController';
// import { container } from 'tsyringe';
// import { permissionGate } from '../middlewares/permissionGate.middleware';

// // Controllers
// const adminController = container.resolve<IAdminController>('AdminController')

// // Middlewares
// router.use(permissionGate(["Admin"]))

// // Get requests
// router.get('/', (req, res, next) => adminController.verifyAdmin(req, res, next))
// router.get('/clients', (req, res, next) => adminController.recentClients(req, res, next))
// router.get('/recent-clients', (req, res, next) => adminController.recentClients(req, res, next))
// router.get('/get-client/:role/:id', (req, res, next) => adminController.getClient(req, res, next))
// router.get('/get-plan/:entity/:id', (req, res, next) => adminController.getPlan(req, res, next))

// // Post requests
// router.post('/create-plan', (req, res, next) => adminController.createPlan(req, res, next))
// router.post('/edit-plan', (req, res, next) => adminController.editPlan(req, res, next))
// router.post('/change-plan-status', (req, res, next) => adminController.changePlanStatus(req, res, next))


// export default router;
