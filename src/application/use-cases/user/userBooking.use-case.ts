import { Types } from "mongoose";
import { UserFetchAllBookingsResponseProps } from "../../../shared/interface/userInterface";
import { BookingRepositoryImpl } from "../../../infrastructure/database/booking/booking.repository.impl";

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