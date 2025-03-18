import { Router } from 'express';
import { providerController } from './provider.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/addAddress/:providerId',authMiddleware, providerController.addAddress);
router.get('/fetchAllServices', authMiddleware, providerController.fetchAllServices);
router.post('/addServiceDetails/:providerId', authMiddleware,upload.single('certificate'), providerController.addServiceDetails);
router.post('/addProviderServiceAvailability', authMiddleware, providerController.addProviderServiceAvailability);

export default router;  