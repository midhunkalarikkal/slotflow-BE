import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { UserAppointmentBookingViaStripeUseCase, UserSaveBookingAfterStripePaymentUseCase } from "../../application/use-cases/user/userStripeBooking.use-case";

const userRepositoryImpl = new UserRepositoryImpl();
const paymentRepositoryImpl = new PaymentRepositoryImpl();
const bookingRepositoryImpl = new BookingRepositoryImpl();
const proviserRepositoryImpl = new ProviderRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();
const userAppointmentBookingViaStrpieUseCase = new UserAppointmentBookingViaStripeUseCase(proviserRepositoryImpl, providerServiceRepositoryImpl, serviceAvailabilityRepositoryImpl, bookingRepositoryImpl);
const userSaveBookingAfterStripePaymentUseCase = new UserSaveBookingAfterStripePaymentUseCase(userRepositoryImpl, paymentRepositoryImpl, bookingRepositoryImpl, serviceAvailabilityRepositoryImpl);

export class UserBookingController {
    constructor(
        private userAppointmentBookingViaStripeUseCase : UserAppointmentBookingViaStripeUseCase,
        private userSaveBookingAfterStripePaymentUseCase: UserSaveBookingAfterStripePaymentUseCase,
    ) { 
        this.bookingViaStripe = this.bookingViaStripe.bind(this);
        this.saveBookingAfterStripePayment = this.saveBookingAfterStripePayment.bind(this);
    }
    
    async bookingViaStripe(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId, selectedDay, slotId, selectedServiceMode } = req.body;
            if(!userId || !providerId || !selectedDay || !slotId || !selectedServiceMode) throw new Error("Invalid request");
            const result = await this.userAppointmentBookingViaStripeUseCase.execute(userId, providerId, selectedDay, slotId, selectedServiceMode);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }

    async saveBookingAfterStripePayment(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { sessionId } = req.body;
            if(!userId || !sessionId) throw new Error("Invalid request");
            const result = await this.userSaveBookingAfterStripePaymentUseCase.execute(userId, sessionId);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const userBookingController = new UserBookingController( userAppointmentBookingViaStrpieUseCase, userSaveBookingAfterStripePaymentUseCase );
export { userBookingController };