import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { providerPlanController } from './providerPlan.controller';
import { provideAddressController } from './providerAddress.controller';
import { providerServiceController } from './providerService.controller';
import { providerProfileController } from './providerProfile.controller';
import { providerPaymentController } from './providerPayment.controller';
import { providerBookingController } from './providerBooking.controller';
import { providerAppServiceController } from './providerAppService.controller';
import { providerSubscriptionController } from './providerSubscription.controller';
import { providerServiceAvailabilityController } from './providerServiceAvailability.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/addAddress',authMiddleware, provideAddressController.addAddress);
router.get('/getAddress', authMiddleware, provideAddressController.getAddress);

router.get('/fetchAllAppServices', authMiddleware, providerAppServiceController.getAllAppServices);

router.post('/addServiceDetails', authMiddleware,upload.single('certificate'), providerServiceController.addServiceDetails);
router.get('/getServiceDetails', authMiddleware, providerServiceController.getServiceDetails);

router.get('/getProfileDetails', authMiddleware, providerProfileController.getProfileDetails);
router.post('/updateProfileImage', authMiddleware,upload.single('profileImage'), providerProfileController.updateProfileImage);

router.post('/addProviderServiceAvailability', authMiddleware, providerServiceAvailabilityController.addServiceAvailability);
router.get('/getServiceAvailability', authMiddleware, providerServiceAvailabilityController.getServiceAvailability);

router.get('/getPlans', authMiddleware, providerPlanController.fetchAllPlans);

router.get('/getSubscriptions', authMiddleware, providerSubscriptionController.fetchProviderSubscriptions);
router.post('/createSubscriptionCheckoutSession', authMiddleware, providerSubscriptionController.subscribe);
router.post('/saveSubscription', authMiddleware, providerSubscriptionController.saveSubscription);
router.post('/subscribeToTrialPlan', authMiddleware, providerSubscriptionController.subsribetoTrialPlan);

router.get('/getPayments', authMiddleware, providerPaymentController.getPayments);

router.get('/getBookingAppointments', authMiddleware, providerBookingController.fetchBookingAppointments);

export default router;  