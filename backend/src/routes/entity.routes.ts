import express from 'express';
const router = express.Router()
import { IEntityController } from '../controllers/Interface/IEntityController';
import { container } from 'tsyringe';
import { permissionGate } from '../middlewares/permissionGate.middleware';
import { TokenMiddleWare } from '../middlewares/token.middleware';
import { TenantMiddleWare } from '../middlewares/tenant.middleware';

// Controllers
const entityController = container.resolve<IEntityController>('EntityController')

// Get requests
router.get('/get-all-plans', (req, res, next) => entityController.getAllPlans(req, res, next))
router.get('/get-country', (req, res, next) => entityController.getCountry(req, res, next))
router.get('/:role/:planId', (req, res, next) => entityController.getMenu(req, res, next));

// Post requests
router.post('/create-agency', (req, res, next) => entityController.registerAgency(req, res, next))
router.post('/create-company', (req, res, next) => entityController.registerCompany(req, res, next))
router.post('/get-plan', (req, res, next) => entityController.getPlan(req, res, next))
router.post('/check-mail', (req, res, next) => entityController.checkMail(req, res, next))

router.use(TokenMiddleWare)
router.use(TenantMiddleWare)
// router.use(permissionGate(["Company", "Agency", "Employee"]))
router.post('/create-group', (req, res, next) => entityController.createGroup(req, res, next))


router.use(permissionGate(["Company", "Agency", "Client", "Employee"]))
router.post('/chats', (req, res, next) => entityController.getChat(req, res, next))
router.post('/get-chats', (req, res, next) => entityController.getChats(req, res, next))
router.post('/get-messages', (req, res, next) => entityController.getMessages(req, res, next))


router.use(permissionGate(["Company", "Agency"]))

// Get requests
router.get('/get-departments', (req, res, next) => entityController.getDepartments(req, res, next))
router.get('/get-employees', (req, res, next) => entityController.getEmployees(req, res, next))
router.get('/owner', (req, res, next) => entityController.getOwner(req, res, next))

// Post requests
router.post('/create-department', (req, res, next) => entityController.createDepartment(req, res, next))
router.post('/create-employee', (req, res, next) => entityController.createEmployee(req, res, next))



export default router