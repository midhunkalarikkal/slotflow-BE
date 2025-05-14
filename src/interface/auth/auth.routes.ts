import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resendOtp', authController.resendOtp);
router.post("/signin", authController.login);
router.post('/signout', authController.logout);
router.put('/updatePassword',authController.updatePassword);
router.post('/checkUserStatus',authMiddleware,authController.checkUserStatus);

export default router;
