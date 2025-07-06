import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { RequestQueryCommonZodSchema, SaveStripePaymentZodSchema } from "../../infrastructure/zod/common.zod";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { UserCancelBookingUseCase, UserFetchBookingsUseCase } from "../../application/user-use.case/userBooking.use-case";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { UserCancelBookingZodSchema, UserCreateSessionIdForbookingViaStripeZodSchema } from "../../infrastructure/zod/user.zod";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { UserAppointmentBookingViaStripeUseCase, UserSaveBookingAfterStripePaymentUseCase } from "../../application/user-use.case/userStripeBooking.use-case";

const userRepositoryImpl = new UserRepositoryImpl();
const paymentRepositoryImpl = new PaymentRepositoryImpl();
const bookingRepositoryImpl = new BookingRepositoryImpl();
const proviserRepositoryImpl = new ProviderRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();

const userFetchBookingsUseCase = new UserFetchBookingsUseCase(bookingRepositoryImpl);
const userCancelBookingUseCase = new UserCancelBookingUseCase(userRepositoryImpl, bookingRepositoryImpl, paymentRepositoryImpl);
const userSaveBookingAfterStripePaymentUseCase = new UserSaveBookingAfterStripePaymentUseCase(userRepositoryImpl, paymentRepositoryImpl, bookingRepositoryImpl, serviceAvailabilityRepositoryImpl);
const userAppointmentBookingViaStrpieUseCase = new UserAppointmentBookingViaStripeUseCase(proviserRepositoryImpl, providerServiceRepositoryImpl, serviceAvailabilityRepositoryImpl, bookingRepositoryImpl);

export class UserBookingController {
    constructor(
        private userFetchBookingsUseCase: UserFetchBookingsUseCase,
        private userCancelBookingUseCase: UserCancelBookingUseCase,
        private userAppointmentBookingViaStripeUseCase : UserAppointmentBookingViaStripeUseCase,
        private userSaveBookingAfterStripePaymentUseCase: UserSaveBookingAfterStripePaymentUseCase,
    ) { 
        this.fetchBookings = this.fetchBookings.bind(this);
        this.cancelBooking = this.cancelBooking.bind(this);
        this.createSessionIdForbookingViaStripe = this.createSessionIdForbookingViaStripe.bind(this);
        this.saveBookingAfterStripePayment = this.saveBookingAfterStripePayment.bind(this);
    }

    async fetchBookings(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateQueryData = RequestQueryCommonZodSchema.parse(req.query);
            const { page, limit } = validateQueryData;
            if(!userId) throw new Error("Invalid request");
            const result = await this.userFetchBookingsUseCase.execute({userId: new Types.ObjectId(userId), page, limit});
            res.status(200).json(result);
        } catch(error) {
            HandleError.handle(error, res);
        }
    }

    async cancelBooking(req: Request, res:Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateData = UserCancelBookingZodSchema.parse(req.body);
            const { bookingId } = validateData;
            if(!userId || !bookingId) throw new Error("Invalid request");
            const result = await this.userCancelBookingUseCase.execute({userId: new Types.ObjectId(userId), bookingId: new Types.ObjectId(bookingId)});
            res.status(200).json(result);
        }catch(error) {
            HandleError.handle(error, res);
        }
    }
    
    async createSessionIdForbookingViaStripe(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateData = UserCreateSessionIdForbookingViaStripeZodSchema.parse(req.body);
            const { providerId, slotId, date, selectedServiceMode } = validateData;
            if(!userId || !providerId || !slotId || !selectedServiceMode || !date) throw new Error("Invalid request");
            const result = await this.userAppointmentBookingViaStripeUseCase.execute({
                userId: new Types.ObjectId(userId), 
                providerId: new Types.ObjectId(providerId), 
                slotId: new Types.ObjectId(slotId), 
                selectedServiceMode, 
                date: new Date(date),
            });
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }

    async saveBookingAfterStripePayment(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateData = SaveStripePaymentZodSchema.parse(req.body);
            const { sessionId } = validateData;
            if(!userId || !sessionId) throw new Error("Invalid request");
            const result = await this.userSaveBookingAfterStripePaymentUseCase.execute({userId: new Types.ObjectId(userId), sessionId});
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }
    
}

const userBookingController = new UserBookingController(
    userFetchBookingsUseCase, 
    userCancelBookingUseCase, 
    userAppointmentBookingViaStrpieUseCase, 
    userSaveBookingAfterStripePaymentUseCase, 
);

export { userBookingController };