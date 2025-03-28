import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { userProfileController } from "./userProfile.controller";

const router = Router();

router.get('/getProfileDetails', authMiddleware, userProfileController.getProfileDetails);

export default router;