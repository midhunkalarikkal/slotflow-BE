import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminPlanController } from "./adminPlanController";

const router = Router();

router.get('/providers',authMiddleware, adminController.getAllProviders);
router.put('/provider/approve/:providerId',authMiddleware,adminController.approveProvider);
router.put('/provider/changeStatus/:providerId',authMiddleware,adminController.changeProviderStatus);

router.get('/users',authMiddleware, adminController.getAllUsers);
router.put('/user/changeStatus/:userId',authMiddleware,adminController.changeUserStatus);

router.get('/services',authMiddleware, adminController.getAllServices);
router.post('/addNewService',authMiddleware,adminController.addService);
router.put('/changeServiceStatus/:serviceId',authMiddleware, adminController.changeServiceStatus);

router.get('/plans', authMiddleware,adminPlanController.getAllPLans);
router.post('/addNewPlan', authMiddleware, adminPlanController.addNewPlan)

export default router;