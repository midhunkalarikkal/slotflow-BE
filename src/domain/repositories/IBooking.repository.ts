import { Types } from "mongoose";
import { Booking } from "../entities/booking.entity";
import { ApiResponse, FetchBookingsRequest, FetchBookingsResponse } from "../../infrastructure/dtos/common.dto";

export type CreateBookingPayloadProps = Pick<Booking, "serviceProviderId" | "userId" | "appointmentDate" | "appointmentTime" | "appointmentMode" | "appointmentStatus" | "slotId" | "paymentId">;

export type FindAllBookingAppointmentsUsingProviderIdResponseProps = Pick<Booking, "_id" | "appointmentDate" | "appointmentTime" | "appointmentMode" | "appointmentStatus" | "createdAt" | "paymentId">;

export interface IBookingRepository {

    createBooking(booking : CreateBookingPayloadProps, options : { session : any }) : Promise<Booking>;

    findBookingByUserId(userId: Types.ObjectId, day: string, date: Date, time: string): Promise<Array<Booking> | null>;

    findBookingById(bookingId: Types.ObjectId): Promise<Booking | null>;

    updateBooking(booking: Booking) : Promise<Booking | null>;

    findAllBookingAppointmentsUsingProviderId(providerId: Types.ObjectId): Promise<Array<FindAllBookingAppointmentsUsingProviderIdResponseProps> | []>;

    findTodaysBookingForCronjob() : Promise<boolean> ;

    findAllBooking({ page, limit, userId, serviceProviderId }: FetchBookingsRequest) : Promise<ApiResponse<FetchBookingsResponse>>
}