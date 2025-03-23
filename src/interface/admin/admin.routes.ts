import { Router } from "express";
import { adminUserController } from "./adminUser.Controller";
import { adminPlanController } from "./adminPlan.Controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminServiceController } from "./adminService.Controller";
import { adminProviderController } from "./adminProvider.controller";

const router = Router();

router.get('/providers',authMiddleware, adminProviderController.getAllProviders);
router.put('/provider/approve/:providerId',authMiddleware,adminProviderController.approveProvider);
router.put('/provider/changeStatus/:providerId',authMiddleware,adminProviderController.changeProviderStatus);
router.get('/fetchProviderDetails/:providerId', authMiddleware, adminProviderController.fetchProviderDetails);
router.get('/fetchProviderAddress/:providerId', authMiddleware, adminProviderController.fetchProviderAddress);
router.get('/fetchProviderService/:providerId', authMiddleware, adminProviderController.fetchProviderService);
router.get('/fetchProviderServiceAvailability/:providerId', authMiddleware, adminProviderController.fetchProviderServiceAvailability);

router.get('/users',authMiddleware, adminUserController.getAllUsers);
router.put('/user/changeStatus/:userId',authMiddleware,adminUserController.changeUserStatus);

router.get('/services',authMiddleware, adminServiceController.getAllServices);
router.post('/addNewService',authMiddleware,adminServiceController.addService);
router.put('/changeServiceStatus/:serviceId',authMiddleware, adminServiceController.changeServiceStatus);

router.get('/plans', authMiddleware,adminPlanController.getAllPLans);
router.post('/addNewPlan', authMiddleware, adminPlanController.addNewPlan);
router.put('/changePlanStatus/:planId', authMiddleware, adminPlanController.changePlanStatus)

export default router;