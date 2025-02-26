import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/providers',authMiddleware, adminController.getAllProviders);
router.get('/users',authMiddleware, adminController.getAllUsers);

export default router;