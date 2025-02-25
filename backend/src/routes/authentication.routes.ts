import express from 'express';
import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController';
import { container } from 'tsyringe';
import 'reflect-metadata';
const router = express.Router()
import { TokenMiddleWare } from '../middlewares/token.middleware';

// Controllers
const authenticationController = container.resolve<IAuthenticationController>('AuthenticationController')

// Post requests
router.post('/login',(req,res,next) => authenticationController.login(req,res,next))
router.post('/forgot-password',(req,res,next) => authenticationController.forgotPassword(req,res,next))
router.post('/reset-password/:token',(req,res,next) => authenticationController.resetPassword(req,res,next))
router.post('/logout',TokenMiddleWare,(req,res,next) => authenticationController.logout(req,res,next))


export default router