import { Types } from "mongoose";
import { Booking } from "../entities/booking.entity";

export type CreateBookingPayloadProps = Pick<Booking, "serviceProviderId" | "userId" | "appointmentDate" | "appointmentTime" | "appointmentMode" | "appointmentStatus" | "slotId" | "paymentId">;

export type FindAllBookingsResponseProps = Pick<Booking, "_id" | "appointmentDate" | "appointmentTime" | "appointmentMode" | "appointmentStatus" | "createdAt" | "paymentId">;

export interface IBookingRepository {

    createBooking(booking : CreateBookingPayloadProps, options : { session : any }) : Promise<Booking>;

    findBookingByUserId(userId: Types.ObjectId, day: string, date: Date, time: string): Promise<Array<Booking> | null>;

    findAllBookingsUsingUserId(userId: Types.ObjectId): Promise<Array<FindAllBookingsResponseProps> | []>;

    findBookingById(bookingId: Types.ObjectId): Promise<Booking | null>;

    updateBooking(booking: Booking) : Promise<Booking | null>;
}