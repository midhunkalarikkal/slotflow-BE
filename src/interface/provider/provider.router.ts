import { Router } from 'express';
import { providerController } from './provider.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/addAddress/:providerId',authMiddleware, providerController.addAddress);

export default router;