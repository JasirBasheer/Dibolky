import express from 'express';
const router = express.Router()
import agnecyEntityController from '../controllers/agency/entityController'

router.post('/department',agnecyEntityController.createDepartment)
router.post('/employee',agnecyEntityController.createEmployee)
router.post('/client',agnecyEntityController.createClient)

export default router