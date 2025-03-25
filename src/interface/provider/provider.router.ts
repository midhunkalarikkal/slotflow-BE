import multer from 'multer';
import { Router } from 'express';
import { providerController } from './provider.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/addAddress',authMiddleware, providerController.addAddress);
router.get('/fetchAllServices', authMiddleware, providerController.getAllServices);
router.post('/addServiceDetails', authMiddleware,upload.single('certificate'), providerController.addServiceDetails);
router.post('/addProviderServiceAvailability', authMiddleware, providerController.addServiceAvailability);

router.get('/getProfileDetails', authMiddleware, providerController.getProfileDetails);

export default router;  