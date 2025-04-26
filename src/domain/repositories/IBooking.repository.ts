import { Types } from "mongoose";
import { Booking } from "../entities/booking.entity";

export type CreateBookingPayloadProps = Pick<Booking, "serviceProviderId" | "userId" | "appointmentDate" | "appointmentDay" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "paymentId">;

export type FindAllBookingResponseProps = Pick<Booking, "_id" | "appointmentDay" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" | "paymentId">;

export interface IBookingRepository {

    createBooking(booking : CreateBookingPayloadProps, options : { session : any }) : Promise<Booking>;

    findBookingByUserId(userId: Types.ObjectId, day: string, date: Date, time: string): Promise<Array<Booking> | null>;

    findAllBookingUsingUserId(userId: Types.ObjectId): Promise<Array<FindAllBookingResponseProps> | []>
}