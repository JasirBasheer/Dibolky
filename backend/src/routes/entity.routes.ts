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
router.get('/get-trial-plans', (req, res, next) => entityController.getAllTrialPlans(req, res, next))
router.get('/get-plan/:plan_id', (req, res, next) => entityController.getPlan(req, res, next))
router.get('/get-country', (req, res, next) => entityController.getCountry(req, res, next))


// Post requests
router.post('/check-mail', (req, res, next) => entityController.checkMail(req, res, next))
router.post('/create-agency', (req, res, next) => entityController.registerAgency(req, res, next))
router.post('/create-influencer', (req, res, next) => entityController.createInfluencer(req, res, next))

router.use(TokenMiddleWare)
router.use(TenantMiddleWare)


// need permission inorder to enter to the routes that given below
router.use(permissionGate(["agency", "client", "influencer"]))


// get
router.get('/owner', (req, res, next) => entityController.getOwner(req, res, next))
router.get('/get-tasks', (req, res, next) => entityController.getAllProjects(req, res, next))
router.get('/projects/:page', (req, res, next) => entityController.getAllProjects(req, res, next))
router.get('/get-chats/:userId', (req, res, next) => entityController.getChats(req, res, next))
router.get('/connect/:provider', (req, res, next) => providerController.connectSocialPlatforms(req, res, next))
router.get('/get-meta-pages/:access_token', (req, res, next) => providerController.getMetaPagesDetails(req, res, next))
router.get('/contents/:user_id', (req, res, next) => entityController.fetchContents(req, res, next))
router.get('/get-scheduled-contents/:user_id', (req, res, next) => entityController.fetchAllScheduledContents(req, res, next))
router.get('/get-connections/:entity/:user_id', (req, res, next) => entityController.getConnections(req, res, next))

router.get('/:role/:planId', (req, res, next) => entityController.getMenu(req, res, next));





// content
router.post('/approve-content', (req, res, next) => providerController.processContentApproval(req, res, next))
router.post('/reject-content', (req, res, next) => providerController.processContentReject(req, res, next))
router.post('/reschedule-content', (req, res, next) => providerController.reScheduleContent(req, res, next))
router.post('/content/save/:platform/:user_id', (req, res, next) => entityController.saveContent(req, res, next))
router.post('/initiate-s3-batch-upload', (req, res, next) => entityController.initiateS3BatchUpload(req, res, next))

router.post('/save-platform-token/:platform/:provider/:user_id', (req, res, next) => providerController.saveSocialPlatformToken(req, res, next))


// aws s3
router.post('/get-signedUrl', (req, res, next) => entityController.getS3ViewUrl(req, res, next))
router.post('/get-s3Upload-url', (req, res, next) => entityController.getUploadS3Url(req, res, next))


// chat
router.post('/chats', (req, res, next) => entityController.getChat(req, res, next))
router.post('/get-messages', (req, res, next) => entityController.getMessages(req, res, next))
router.post('/create-group', (req, res, next) => entityController.createGroup(req, res, next))


// settings
router.post('/update-profile', (req, res, next) => entityController.updateProfile(req, res, next))


// leads 





export default router