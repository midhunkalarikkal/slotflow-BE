import multer from "multer";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { userProfileController } from "./userProfile.controller";
import { userAddressController } from './userAddress.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get('/getProfileDetails', authMiddleware, userProfileController.getProfileDetails);
router.post('/updateProfileImage', authMiddleware, upload.single("profileImage"), userProfileController.updateProfileImage);

router.get('/getAddress', authMiddleware, userAddressController.getAddress);
export default router;