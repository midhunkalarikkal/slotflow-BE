import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { providerPlanController } from './providerPlan.controller';
import { provideAddressController } from './providerAddress.controller';
import { providerServiceController } from './providerService.controller';
import { providerProfileController } from './providerProfile.controller';
import { providerAppServiceController } from './providerAppService.controller';
import { providerSubscriptionController } from './providerSubscription.controller';
import { providerServiceAvailabilityController } from './providerServiceAvailability.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/addAddress',authMiddleware, provideAddressController.addAddress);
router.get('/fetchAllAppServices', authMiddleware, providerAppServiceController.getAllAppServices);
router.post('/addServiceDetails', authMiddleware,upload.single('certificate'), providerServiceController.addServiceDetails);
router.post('/addProviderServiceAvailability', authMiddleware, providerServiceAvailabilityController.addServiceAvailability);

router.get('/getProfileDetails', authMiddleware, providerProfileController.getProfileDetails);
router.get('/getAddress', authMiddleware, provideAddressController.getAddress);
router.get('/getServiceDetails', authMiddleware, providerServiceController.getServiceDetails);
router.get('/getServiceAvailability', authMiddleware, providerServiceAvailabilityController.getServiceAvailability);
router.post('/updateProfileImage', authMiddleware,upload.single('profileImage'), providerProfileController.updateProfileImage);

router.get('/getPlans', authMiddleware, providerPlanController.fetchAllPlans);

router.post('/create-checkout-session', authMiddleware, providerSubscriptionController.subscribe);
router.post('/saveSubscription', authMiddleware, providerSubscriptionController.saveSubscription);
export default router;  