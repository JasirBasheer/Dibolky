import express from 'express';
const router = express.Router()
import authenticationController from '../controllers/authenticatoin/authenticationController';

router.post('/login',authenticationController.login)
router.post('/forgot-password',authenticationController.forgotPassword)
router.post('/reset-password/:token',authenticationController.resetPassword)

export default router