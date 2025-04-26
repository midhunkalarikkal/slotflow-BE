import { Booking } from "../entities/booking.entity";

export type createBookingPayloadProps = Pick<Booking, "serviceProviderId" | "userId" | "appointmentDay" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "paymentId">;

export interface IBookingRepository {
    createBooking(booking : createBookingPayloadProps, options : { session : any }) : Promise<Booking>;
}