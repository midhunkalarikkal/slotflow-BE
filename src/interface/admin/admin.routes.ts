import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/providers',authMiddleware, adminController.getAllProviders);
router.put('/provider/approve/:providerId',authMiddleware,adminController.approveProvider);
router.put('/provider/changeStatus/:providerId',authMiddleware,adminController.changeProviderStatus);

router.get('/users',authMiddleware, adminController.getAllUsers);
router.put('/user/changeStatus/:userId',authMiddleware,adminController.changeUserStatus);

export default router;