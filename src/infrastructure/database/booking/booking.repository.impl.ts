import { Types } from "mongoose";
import { BookingModel, IBooking } from "./booking.model";
import { Booking } from "../../../domain/entities/booking.entity";
import { CreateBookingPayloadProps, FindAllBookingsResponseProps, IBookingRepository } from "../../../domain/repositories/IBooking.repository";

export class BookingRepositoryImpl implements IBookingRepository {
    private mapToEntity(booking : IBooking) : Booking {
        return new Booking(
                booking._id,
                booking.serviceProviderId,
                booking.userId,
                booking.appointmentDate,
                booking.appointmentTime,
                booking.appointmentMode,
                booking.appointmentStatus,
                booking.slotId,
                booking.paymentId,
                booking.createdAt,
                booking.updatedAt,
        )
    }

    async createBooking(booking: CreateBookingPayloadProps, options : { session?: any } ): Promise<Booking> {
        try {
            const newBooking = await BookingModel.create([booking], options);
            return this.mapToEntity(newBooking[0]);
        } catch (error) {
            throw new Error("Appointment booking creating error");
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

    async findAllBookingsUsingUserId(userId: Types.ObjectId): Promise<Array<FindAllBookingsResponseProps> | []> {
        try {
            const bookings = await BookingModel.find({
                userId : userId
            },{
                appointmentDay: 1, appointmentDate: 1, appointmentMode: 1, appointmentStatus: 1, appointmentTime: 1, createdAt: 1
            });
            return bookings ?  bookings.map((booking) => this.mapToEntity(booking)) : [];
        } catch (error) {
            throw new Error("Bookings fetching error");
        }
    }
    
    async findBookingById(bookingId: Types.ObjectId): Promise<Booking | null> {
        try{
            const booking = await BookingModel.findById(bookingId);
            return booking ? this.mapToEntity(booking) : null;
        }catch(error){
            throw new Error("Finding booking error");
        }
    }

    async updateBooking(booking: Booking): Promise<Booking | null> {
        try{
            const updatedBooking = await BookingModel.findByIdAndUpdate(
                booking._id,
                { ...booking },
                { new: true }
            );
            return updatedBooking ? this.mapToEntity(updatedBooking) : null;
        }catch(error){
            throw new Error("Booking updating error");
        }
    }
}