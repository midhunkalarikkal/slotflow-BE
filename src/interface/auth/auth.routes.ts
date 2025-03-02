import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.register);
router.post('/resendOtp', authController.resendOtp);
router.post('/verify-otp', authController.verifyOTP);
router.post("/signin", authController.login);
router.post('/signout', authController.logout);
router.post('/refresh',authMiddleware, authController.refreshAccessToken);

export default router;
