import express from 'express';
const router = express.Router()
import { IEntityController } from '../controllers/Interface/IEntityController';
import { container } from 'tsyringe';
import { permissionGate } from '../middlewares/permissionGate.middleware';
import { TokenMiddleWare } from '../middlewares/token.middleware';
import { TenantMiddleWare } from '../middlewares/tenant.middleware';
import { IProviderController } from '../controllers/Interface/IProviderController';

// Controllers
const entityController = container.resolve<IEntityController>('EntityController')
const providerController = container.resolve<IProviderController>('ProviderController')

// Get requests
router.get('/get-all-plans', (req, res, next) => entityController.getAllPlans(req, res, next))
router.get('/get-country', (req, res, next) => entityController.getCountry(req, res, next))


// Post requests
router.post('/create-agency', (req, res, next) => entityController.registerAgency(req, res, next))
router.post('/create-influencer', (req, res, next) => entityController.createInfluencer(req, res, next))
router.post('/get-plan', (req, res, next) => entityController.getPlan(req, res, next))
router.post('/check-mail', (req, res, next) => entityController.checkMail(req, res, next))

router.use(TokenMiddleWare)
router.use(TenantMiddleWare)


// router.use(permissionGate(["Company", "agency"]))
router.get('/owner', (req, res, next) => entityController.getOwner(req, res, next))
router.get('/projects', (req, res, next) => entityController.getAllProjects(req, res, next))
router.get('/get-tasks', (req, res, next) => entityController.getAllProjects(req, res, next))



router.use(permissionGate(["agency", "Client", "influencer"]))
router.get('/get-chats/:userId', (req, res, next) => entityController.getChats(req, res, next))
router.post('/approve-content', (req, res, next) => providerController.processContentApproval(req, res, next))
router.get('/get-review-bucket/:user_id', (req, res, next) => entityController.fetchContents(req, res, next))
router.get('/connect/:provider', (req, res, next) => providerController.connectSocialPlatforms(req, res, next))
router.get('/get-meta-pages/:access_token', (req, res, next) => providerController.getMetaPagesDetails(req, res, next))
router.get('/:role/:planId', (req, res, next) => entityController.getMenu(req, res, next));
router.post('/save-platform-token/:platform/:provider/:user_id', (req, res, next) => providerController.saveSocialPlatformToken(req, res, next))
router.post('/initiate-s3-batch-upload', (req, res, next) => entityController.initiateS3BatchUpload(req, res, next))
router.post('/content/save/:platform/:user_id', (req, res, next) => entityController.saveContent(req, res, next))
router.post('/get-signedUrl', (req, res, next) => entityController.getS3ViewUrl(req, res, next))

router.post('/chats', (req, res, next) => entityController.getChat(req, res, next))
router.post('/get-messages', (req, res, next) => entityController.getMessages(req, res, next))
router.post('/create-group', (req, res, next) => entityController.createGroup(req, res, next))






export default router