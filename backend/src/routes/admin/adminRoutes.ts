import express from 'express';
const router = express.Router();
import { TokenMiddleWare } from '../../middlewares/tokenMiddleware';
import { IAdminController } from '../../controllers/Interface/IAdminController';
import { container } from 'tsyringe';

const adminController = container.resolve<IAdminController>('IAdminController')

router.get('/', TokenMiddleWare, (req, res, next) => adminController.verifyAdmin(req, res, next))
router.get('/clients', TokenMiddleWare, (req, res, next) => adminController.recentClients(req, res, next))
router.get('/recent-clients', TokenMiddleWare, (req, res, next) => adminController.recentClients(req, res, next))
router.get('/get-client/:role/:id', (req, res, next) => adminController.getClient(req, res, next))


export default router;
