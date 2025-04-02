import { Router } from "express";
import { adminUserController } from "./adminUser.Controller";
import { adminPlanController } from "./adminPlan.Controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminServiceController } from "./adminService.Controller";
import { adminProviderController } from "./adminProvider.controller";

const router = Router();

router.get('/providers',authMiddleware, adminProviderController.getAllProviders);
router.put('/approveProvider',authMiddleware,adminProviderController.approveProvider);
router.put('/changeProviderStatus',authMiddleware,adminProviderController.changeProviderStatus);
router.post('/changeProvidertrustedTag', authMiddleware, adminProviderController.changeProviderTrustedTag);
router.get('/fetchProviderDetails/:providerId', authMiddleware, adminProviderController.fetchProviderDetails);
router.get('/fetchProviderAddress/:providerId', authMiddleware, adminProviderController.fetchProviderAddress);
router.get('/fetchProviderService/:providerId', authMiddleware, adminProviderController.fetchProviderService);
router.get('/fetchProviderServiceAvailability/:providerId', authMiddleware, adminProviderController.fetchProviderServiceAvailability);
router.get('/fetchProviderSubscriptions/:providerId', authMiddleware, adminProviderController.fetchProviderSubscriptions);
router.get('/fetchProviderPayments/:providerId', authMiddleware,adminProviderController.fetchProviderPayments);

router.get('/users',authMiddleware, adminUserController.getAllUsers);
router.put('/changeUserStatus',authMiddleware,adminUserController.changeUserStatus);

router.get('/services',authMiddleware, adminServiceController.getAllServices);
router.post('/addNewService',authMiddleware,adminServiceController.addService);
router.put('/changeServiceStatus/:serviceId',authMiddleware, adminServiceController.changeServiceStatus);

router.get('/plans', authMiddleware,adminPlanController.getAllPLans);
router.post('/addNewPlan', authMiddleware, adminPlanController.addNewPlan);
router.put('/changePlanStatus/:planId', authMiddleware, adminPlanController.changePlanStatus)

export default router;