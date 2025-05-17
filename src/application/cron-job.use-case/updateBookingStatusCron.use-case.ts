import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";

export class UpdateBookingStatusCronUseCase {
    constructor(
        private bookingRepositoryImpl: BookingRepositoryImpl,
    ) { }

    async execute(): Promise<boolean> {
        const todaysExhaustedBookings = await this.bookingRepositoryImpl.findTodaysBookingForCronjob();
        return todaysExhaustedBookings;
    }
}