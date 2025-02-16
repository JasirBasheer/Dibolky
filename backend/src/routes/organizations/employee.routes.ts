import express from 'express';
import { container } from 'tsyringe';
import { TenantMiddleWare } from '../../middlewares/tenant.middleware';
import { IEmployeeController } from '../../controllers/Interface/IEmployeeController';
const router = express.Router()

// Controllers
const employeeController = container.resolve<IEmployeeController>('EmployeeController')

// Middlewares
router.use(TenantMiddleWare)

// Get requests
router.get('/', (req, res, next) =>employeeController.getEmployee(req,res,next))


// Post requests

export default router


