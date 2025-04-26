import Stripe from "stripe";
import { startSession, Types } from "mongoose";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { FindProviderServiceResProps } from "../../../domain/repositories/IProviderService.repository";
import { PaymentRepositoryImpl } from "../../../infrastructure/database/payment/payment.repository.impl";
import { BookingRepositoryImpl } from "../../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class UserAppointmentBookingViaStripeUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private providerServiceRepository: ProviderServiceRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
        private bookingRepository: BookingRepositoryImpl,
    ) { }

    async execute(userId: string, providerId: string, selectedDay: string, slotId: string, selectedServiceMode: string, date: string): Promise<{ success: boolean, message: string, sessionId: string }> {
        if (!userId || !providerId || !selectedDay || !slotId || !selectedServiceMode || !date) throw new Error("Invalid request");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("No provider found");
        
        const providerService = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        if (!providerService) throw new Error("No service found");
        
        function isServiceData(obj: any): obj is FindProviderServiceResProps {
            return obj && typeof obj === 'object' && '_id' in obj;
        }
        
        if (!isServiceData(providerService)) throw new Error("No service data found");
        
        const providerServiceAvailability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (!providerServiceAvailability) throw new Error("No availability found");
        
        const dayAvailability = providerServiceAvailability.availability.filter((avail) => avail.day === selectedDay);
        if (!dayAvailability || dayAvailability.length === 0) throw new Error("No available slots found for this day");

        const selectedSlot = dayAvailability[0].slots.filter((slot) => slot._id.toString() === slotId);
        if (!selectedSlot || selectedSlot.length === 0) throw new Error("Not slot found");
        
        if (!selectedSlot[0].available) throw new Error("This slot is not available for today");

        const existBooking = await this.bookingRepository.findBookingByUserId(new Types.ObjectId(userId), selectedDay, new Date(date), selectedSlot[0].slot);
        if(existBooking && existBooking.length > 0) throw new Error("You have already an appointment on the same time");
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: providerService.serviceName,
                        description: providerService.serviceDescription,
                    },
                    unit_amount: providerService.servicePrice * 100,
                },
                quantity: 1
            }],
            success_url: `http://localhost:5173/user/payment-success/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/user/payment-failed/`,
            metadata: {
                providerId: providerId,
                selectedDay: selectedDay,
                slotId: slotId,
                appointmentDate: date,
                selectedServiceMode: selectedServiceMode,
                initialAmount: providerService.servicePrice * 100,
                totalAmount: providerService.servicePrice * 100,
            }
        });
        return { success: true, message: "Session id generated.", sessionId: session.id };

    }

}

export class UserSaveBookingAfterStripePaymentUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private paymentRepository: PaymentRepositoryImpl,
        private bookingRepository: BookingRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ) { }

    async execute(userId: string, sessionId: string): Promise<CommonResponse> {
        if (!userId || !sessionId) throw new Error("Invalid request");

        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if (!user) throw new Error("No user found");

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const providerId = session?.metadata?.providerId;
        const selectedDay = session?.metadata?.selectedDay;
        const slotId = session?.metadata?.slotId;
        const selectedServiceMode = session?.metadata?.selectedServiceMode;
        const initialAmount = session?.metadata?.initialAmount;
        const totalAmount = session?.metadata?.totalAmount;
        const paymentStatus = session?.payment_status === "paid" ? "Paid" : "Pending";
        const paymentType = session?.payment_method_types[0];
        const dateString = session?.metadata?.appointmentDate;

        if (!providerId || !selectedDay || !slotId || !selectedServiceMode || !initialAmount || !totalAmount || !paymentStatus || !paymentType || !dateString) throw new Error("Unexpected error, please try again");

        const providerServiceAvailability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (!providerServiceAvailability) throw new Error("No availability found");

        const dayAvailability = providerServiceAvailability.availability.filter((avail) => avail.day === selectedDay);
        if (!dayAvailability || dayAvailability.length === 0) throw new Error("No available slots found for this day");

        const selectedSlot = dayAvailability[0].slots.filter((slot) => slot._id.toString() === slotId);
        if (!selectedSlot || selectedSlot.length === 0) throw new Error("Not slot found");

        if (!selectedSlot[0].available) throw new Error("This slot is not available for today");

        const mongoSession = await startSession();
        mongoSession.startTransaction();

        try {
            const payment = await this.paymentRepository.createPaymentForBooking({
                transactionId: session.id,
                paymentStatus: paymentStatus,
                paymentMethod: paymentType,
                paymentGateway: "Stripe",
                paymentFor: "Appointment Booking",
                initialAmount: Number(initialAmount) / 100,
                discountAmount: 0,
                totalAmount: Number(totalAmount) / 100,
                userId: new Types.ObjectId(userId),
            }, { session: mongoSession });

            if (!payment) throw new Error("Unexpected error, payment saving error.");

            const newBooking = await this.bookingRepository.createBooking({
                serviceProviderId: new Types.ObjectId(providerId),
                userId: new Types.ObjectId(userId),
                appointmentDate: new Date(dateString),
                appointmentDay: selectedDay,
                appointmentMode: selectedServiceMode,
                appointmentStatus: "Booked",
                appointmentTime: selectedSlot[0].slot,
                paymentId: payment._id
            }, { session: mongoSession });

            if (!newBooking) throw new Error("Error in slot booking, please try again");

            const updatedProviderServiceAvailability = await this.serviceAvailabilityRepository.updateServiceAvailability(new Types.ObjectId(providerId), selectedDay, new Types.ObjectId(slotId), { session: mongoSession });
            if (!updatedProviderServiceAvailability) throw new Error("Error in booking, please try again");

            await mongoSession.commitTransaction();
            mongoSession.endSession();

            return { success: true, message: "Your booking have been confirmed" }
        } catch (error) {
            console.log("error : ", error);
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            throw new Error("Subscribing error.");
        }

    }
}