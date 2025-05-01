import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { UserCancelBookingUseCase, UserFetchBookingsUseCase } from "../../application/use-cases/user/userBooking.use-case";
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
const userFetchBookingsUseCase = new UserFetchBookingsUseCase(bookingRepositoryImpl);
const userCancelBookingUseCase = new UserCancelBookingUseCase(userRepositoryImpl, bookingRepositoryImpl, paymentRepositoryImpl);

export class UserBookingController {
    constructor(
        private userAppointmentBookingViaStripeUseCase : UserAppointmentBookingViaStripeUseCase,
        private userSaveBookingAfterStripePaymentUseCase: UserSaveBookingAfterStripePaymentUseCase,
        private userFetchBookingsUseCase: UserFetchBookingsUseCase,
        private userCancelBookingUseCase: UserCancelBookingUseCase,
    ) { 
        this.bookingViaStripe = this.bookingViaStripe.bind(this);
        this.saveBookingAfterStripePayment = this.saveBookingAfterStripePayment.bind(this);
        this.fetchBookings = this.fetchBookings.bind(this);
        this.cancelBooking = this.cancelBooking.bind(this);
    }
    
    async bookingViaStripe(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId, selectedDay, slotId, selectedServiceMode, date } = req.body;
            if(!userId || !providerId || !selectedDay || !slotId || !selectedServiceMode || !date) throw new Error("Invalid request");
            const result = await this.userAppointmentBookingViaStripeUseCase.execute(userId, providerId, selectedDay, slotId, selectedServiceMode, date);
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

    async fetchBookings(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            if(!userId) throw new Error("Invalid request");
            const result = await this.userFetchBookingsUseCase.execute(userId);
            res.status(200).json(result);
        } catch(error) {
            HandleError.handle(error, res);
        }
    }

    async cancelBooking(req: Request, res:Response) {
        try {
            console.log("cancel booking");
            const userId = req.user.userOrProviderId;
            const { bookingId } = req.params;
            console.log("bookingId : ",bookingId);
            if(!userId || !bookingId) throw new Error("Invalid request");
            const result = await this.userCancelBookingUseCase.execute(userId, bookingId);
            res.status(200).json(result);
        }catch(error) {
            HandleError.handle(error, res);
        }
    }
}

const userBookingController = new UserBookingController( userAppointmentBookingViaStrpieUseCase, userSaveBookingAfterStripePaymentUseCase, userFetchBookingsUseCase, userCancelBookingUseCase );
export { userBookingController };