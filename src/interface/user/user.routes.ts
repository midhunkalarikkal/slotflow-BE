import multer from "multer";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { userProfileController } from "./userProfile.controller";
import { userAddressController } from './userAddress.controller';
import { userPaymentController } from "./userPayment.controller";
import { userBookingController } from "./userBooking.controller";
import { userProviderController } from "./userProvider.controller";
import { userAppServiceController } from "./userAppService.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get('/getProfileDetails', authMiddleware, userProfileController.getProfileDetails);
router.post('/updateProfileImage', authMiddleware, upload.single("profileImage"), userProfileController.updateProfileImage);
router.put('/updateUserInfo', authMiddleware, userProfileController.updateUserInfo);

router.post('/addAddress', authMiddleware, userAddressController.addAddress);
router.get('/getAddress', authMiddleware, userAddressController.getAddress);

router.get('/getAllServices', authMiddleware, userAppServiceController.fetchAllAppService);

router.get('/getServiceProviders/:selectedServices?', authMiddleware, userProviderController.fetchServiceProviders);
router.get('/getServiceProviderProfileDetails/:providerId', authMiddleware, userProviderController.fetchServiceProviderProfileDetails);
router.get('/getServiceProviderAddress/:providerId', authMiddleware, userProviderController.fetchServiceProviderAddress);
router.get('/getServiceProviderServiceDetails/:providerId', authMiddleware, userProviderController.fetchServiceProviderServiceDetails);
router.get('/getServiceProviderServiceAvailability/:providerId', authMiddleware, userProviderController.fetchServiceProviderServiceAvailability);

router.post('/createBookingCheckoutSession', authMiddleware, userBookingController.createSessionIdForbookingViaStripe);
router.post('/saveAppointmentBooking', authMiddleware, userBookingController.saveBookingAfterStripePayment);
router.get('/getBookings', authMiddleware, userBookingController.fetchBookings);
router.put('/cancelBooking/:bookingId', authMiddleware, userBookingController.cancelBooking);

router.get('/getPayments', authMiddleware, userPaymentController.fetchPayments);

router.get('/getProvidersForChatSidebar', authMiddleware, userProviderController.fetchProvidersForChatSidebar);



export default router;