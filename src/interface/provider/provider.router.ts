import { Router } from 'express';
import { providerController } from './provider.controller';

const router = Router();

router.get('/checkApprovalStatus/:providerId',providerController.checkApprovalStatus);

export default router;