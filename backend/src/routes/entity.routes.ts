import express from 'express';
const router = express.Router()
import { IEntityController } from '../controllers/Interface/IEntityController';
import { container } from 'tsyringe';

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

export default router