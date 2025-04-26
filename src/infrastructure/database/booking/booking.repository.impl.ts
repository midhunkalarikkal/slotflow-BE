import { Types } from "mongoose";
import { BookingModel, IBooking } from "./booking.model";
import { Booking } from "../../../domain/entities/booking.entity";
import { createBookingPayloadProps, IBookingRepository } from "../../../domain/repositories/IBooking.repository";

export class BookingRepositoryImpl implements IBookingRepository {
    private mapToEntity(booking : IBooking) : Booking {
        return new Booking(
                booking._id,
                booking.serviceProviderId,
                booking.userId,
                booking.appointmentDate,
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
    
    async findBookingByUserId(userId: Types.ObjectId, day: string, date: Date, time: string): Promise<Array<Booking> | null> {
        try {
            const bookings = await BookingModel.find({
                userId: userId,
                appointmentDay: day,
                createdAt: date,
                appointmentTime: time,
                appointmentStatus: "Booked",
            });
            return bookings;
        } catch(error) {
            throw new Error("Booking fetching error");
        }
    }
}