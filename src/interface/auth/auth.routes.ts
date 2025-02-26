import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/signup', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post("/signin",authController.login);
router.post('/signout',authController.logout);

export default router;
