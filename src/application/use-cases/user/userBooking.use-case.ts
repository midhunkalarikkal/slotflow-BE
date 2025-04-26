import { Types } from "mongoose";
import { BookingRepositoryImpl } from "../../../infrastructure/database/booking/booking.repository.impl";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { FindAllBookingResponseProps } from "../../../domain/repositories/IBooking.repository";

interface UserFetchAllBookingsResponseProps extends CommonResponse {
    bookings : Array<FindAllBookingResponseProps>
}

export class UserFetchBookingsUseCase {
    constructor(
        private bookingRepository: BookingRepositoryImpl
    ) { }

    async execute(userId: string) : Promise<UserFetchAllBookingsResponseProps> {
        if(!userId) throw new Error("Invalid request");

        const bookings = await this.bookingRepository.findAllBookingUsingUserId(new Types.ObjectId(userId));
        if(!bookings) throw new Error("Bookings fetching error");

        console.log("bookings : ",bookings)

        return { success : true, message : "Bookings fetched" , bookings }

    }
}