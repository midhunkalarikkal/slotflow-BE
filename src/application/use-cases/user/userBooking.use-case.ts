import { Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking.entity";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { BookingRepositoryImpl } from "../../../infrastructure/database/booking/booking.repository.impl";

type FindAllBookingsResponseProps = Pick<Booking, "_id" | "appointmentDay" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" | "paymentId">;
interface UserFetchAllBookingsResponseProps extends CommonResponse {
    bookings : Array<FindAllBookingsResponseProps>
}

export class UserFetchBookingsUseCase {
    constructor(
        private bookingRepository: BookingRepositoryImpl
    ) { }

    async execute(userId: string) : Promise<UserFetchAllBookingsResponseProps> {
        if(!userId) throw new Error("Invalid request");

        const bookings = await this.bookingRepository.findAllBookingsUsingUserId(new Types.ObjectId(userId));
        if(!bookings) throw new Error("Bookings fetching error");

        return { success : true, message : "Bookings fetched" , bookings }

    }
}