import express from 'express';
const router = express.Router()
import agnecyEntityController from '../controllers/agency/entityController'
import { TenantMiddleWare } from '../middlewares/TenantMiddleWareMiddleware';

router.use(TenantMiddleWare)
router.get('/',agnecyEntityController.getAgency)
router.post('/department',agnecyEntityController.createDepartment)
router.post('/employee',agnecyEntityController.createEmployee)
router.post('/client',agnecyEntityController.createClient)

export default router