import { Router } from "express";
import { adminUserController } from "./adminUser.Controller";
import { adminPlanController } from "./adminPlan.Controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminServiceController } from "./adminService.Controller";
import { adminPaymentController } from "./adminPayment.Controller";
import { adminProviderController } from "./adminProvider.controller";
import { adminSubscriptionController } from "./adminSubscription.Controller";

const router = Router();

router.get('/providers',authMiddleware, adminProviderController.getAllProviders);
router.patch('/approveProvider',authMiddleware,adminProviderController.approveProvider);
router.patch('/changeProviderBlockStatus',authMiddleware,adminProviderController.changeProviderBlockStatus);
router.patch('/changeProvidertrustedTag', authMiddleware, adminProviderController.changeProviderTrustedTag);
// TODO Trust tag removing rout
router.get('/fetchProviderDetails/:providerId', authMiddleware, adminProviderController.fetchProviderDetails);
router.get('/fetchProviderAddress/:providerId', authMiddleware, adminProviderController.fetchProviderAddress);
router.get('/fetchProviderService/:providerId', authMiddleware, adminProviderController.fetchProviderService);
router.get('/fetchProviderServiceAvailability/:providerId', authMiddleware, adminProviderController.fetchProviderServiceAvailability);
router.get('/fetchProviderSubscriptions/:providerId', authMiddleware, adminProviderController.fetchProviderSubscriptions);
router.get('/fetchProviderPayments/:providerId', authMiddleware,adminProviderController.fetchProviderPayments);

router.get('/users',authMiddleware, adminUserController.getAllUsers);
router.patch('/changeUserBlockStatus',authMiddleware,adminUserController.changeUserBlockStatus);

router.get('/services',authMiddleware, adminServiceController.getAllServices);
router.post('/addNewService',authMiddleware,adminServiceController.addService);
router.patch('/changeServiceBlockStatus',authMiddleware, adminServiceController.changeServiceBlockStatus);

router.get('/plans', authMiddleware,adminPlanController.getAllPLans);
router.post('/addNewPlan', authMiddleware, adminPlanController.addNewPlan);
router.patch('/changePlanBlockStatus/', authMiddleware, adminPlanController.changePlanBlockStatus);

router.get('/getSubscriptions', authMiddleware, adminSubscriptionController.getAllSubscriptions);
router.get('/getSubscription/:subscriptionId', authMiddleware, adminSubscriptionController.getSubscriptionDetails);


router.get('/getPayments', authMiddleware, adminPaymentController.getAllPayments);
export default router;