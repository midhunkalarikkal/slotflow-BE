import Stripe from "stripe";
import mongoose, { Types } from "mongoose";
import { Validator } from "../../infrastructure/validator/validator";
import { AppointmentStatus } from "../../domain/entities/booking.entity";
import { UserCancelBookingRequest } from "../../infrastructure/dtos/user.dto";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ApiResponse, FetchBookingsRequest, FetchBookingsResponse } from "../../infrastructure/dtos/common.dto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export class UserFetchBookingsUseCase {
    constructor(
        private bookingRepositoryImpl: BookingRepositoryImpl
    ) { }

    async execute({ userId, page, limit }: FetchBookingsRequest): Promise<ApiResponse<FetchBookingsResponse>> {
        if (!userId) throw new Error("Invalid request");

        Validator.validateObjectId(userId, "userId");

        const result = await this.bookingRepositoryImpl.findAllBookings({page, limit, userId});
        if (!result) throw new Error("Bookings fetching error");

        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}


export class UserCancelBookingUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private bookingRepositoryImpl: BookingRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) { }

    async execute({ userId, bookingId }: UserCancelBookingRequest): Promise<ApiResponse> {
        if (!userId || !bookingId) throw new Error("Invalid request");

        Validator.validateObjectId(userId, "userId");
        Validator.validateObjectId(bookingId, "bookingId");

        const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
        if (!user) throw new Error("No user found");

        const booking = await this.bookingRepositoryImpl.findBookingById(new Types.ObjectId(bookingId));
        if (!booking) throw new Error("No booking found");

        if (booking.appointmentStatus === "Cancelled") {
            throw new Error("Already cancelled");
        } else if(booking.appointmentStatus === "Completed") {
            throw new Error("Appointment completed")
        } else if(booking.appointmentStatus === "Rejected By Provider") {
            throw new Error("Appointment rejected by the Service provider")
        }

        if (!booking.paymentId) throw new Error("No payment id found");
        const payment = await this.paymentRepositoryImpl.findPaymentById(new Types.ObjectId(booking.paymentId));
        if (!payment) throw new Error("No payment found for this booking");

        const mongooseSession = await mongoose.startSession();
        mongooseSession.startTransaction();

        try {

            booking.appointmentStatus = AppointmentStatus.Cancelled;
            const updateBooking = await this.bookingRepositoryImpl.updateBooking(booking);
            if (!updateBooking) throw new Error("Booking status updating error");

            if (payment.paymentGateway === "Stripe") {

                let refundAmount = 0
                const currentDate = new Date();
                const appointmentDate = new Date(booking.appointmentDate);
                currentDate.setHours(0, 0, 0, 0);
                appointmentDate.setHours(0, 0, 0, 0);
                
                if (appointmentDate > currentDate) {
                    refundAmount = Math.round(payment.totalAmount * 0.90);
                } else if (appointmentDate.getTime() === currentDate.getTime()) {
                    refundAmount = Math.round(payment.totalAmount * 0.50);
                }

                const refund = await stripe.refunds.create({
                    payment_intent: payment.transactionId,
                    amount: refundAmount,
                });

                if (!refund) throw new Error("Refund processinga failed");

                const updatedPayment = await this.paymentRepositoryImpl.updateForCancelBookingRefund({
                    _id: payment._id,
                    transactionId: payment.transactionId,
                    paymentStatus: "Refunded",
                    paymentMethod: payment.paymentMethod,
                    paymentGateway: payment.paymentGateway,
                    paymentFor: payment.paymentFor,
                    initialAmount: payment.initialAmount,
                    discountAmount: payment.discountAmount,
                    totalAmount: payment.totalAmount,
                    userId: payment.userId,

                    refundAmount: refund.amount,
                    refundAt: new Date(refund.created * 1000),
                    refundId: refund.id,
                    refundReason: "Booking cancelled",
                    refundStatus: refund.status ?? "Pending",
                    chargeId: typeof refund.charge === "string" ? refund.charge : refund.charge?.id ?? undefined,
                }, { session: mongooseSession });
                if (!updatedPayment) throw new Error("Refund failed");

                await mongooseSession.commitTransaction();
                mongooseSession.endSession();


                return { success: true, message: "Booking cancelled" }

            } else {
                throw new Error(`Refund not supported for payment gateway: ${payment.paymentGateway}`);
            }

        } catch (error) {
            await mongooseSession.abortTransaction();
            mongooseSession.endSession();
            throw new Error("Booking cancel failed")
        }
    }
}