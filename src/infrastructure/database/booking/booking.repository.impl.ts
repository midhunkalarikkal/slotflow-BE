import { Booking } from "../../../domain/entities/booking.entity";
import { createBookingPayloadProps, IBookingRepository } from "../../../domain/repositories/IBooking.repository";
import { BookingModel, IBooking } from "./booking.model";

export class BookingRepositoryImpl implements IBookingRepository {
    private mapToEntity(booking : IBooking) : Booking {
        return new Booking(
                booking._id,
                booking.serviceProviderId,
                booking.userId,
                booking.appointmentTime,
                booking.appointmentMode,
                booking.appointmentDay,
                booking.appointmentStatus,
                booking.paymentId,
                booking.createdAt,
                booking.updatedAt,
        )
    }

    async createBooking(booking: createBookingPayloadProps, options : { session?: any } ): Promise<Booking> {
        try {
            const newBooking = await BookingModel.create([booking], options);
            return this.mapToEntity(newBooking[0]);
        } catch (error) {
            throw new Error("Appointment booking error");
        }
    }
}