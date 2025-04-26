import { Types } from "mongoose";
import { Booking } from "../entities/booking.entity";

export type createBookingPayloadProps = Pick<Booking, "serviceProviderId" | "userId" | "appointmentDay" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "paymentId">;

export interface IBookingRepository {

    createBooking(booking : createBookingPayloadProps, options : { session : any }) : Promise<Booking>;

    findBookingByUserId(userId: Types.ObjectId, day: string, date: Date, time: string): Promise<Array<Booking> | null>;
}