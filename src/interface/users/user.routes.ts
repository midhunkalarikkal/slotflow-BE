import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/verify-otp', userController.verifyOTP);

export default router;
