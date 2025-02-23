import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post("/login",authController.login);
router.post('/logout',authController.logout);

export default router;
