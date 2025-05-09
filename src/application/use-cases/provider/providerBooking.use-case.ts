import { Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { BookingRepositoryImpl } from "../../../infrastructure/database/booking/booking.repository.impl";

interface ProviderFetchBookingAppointmentsResProps extends CommonResponse {
    bookingAppointments : Array<Pick<Booking, "_id" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" >>;
}
export class ProviderFetchBookingAppointmentsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private bookingRepositoryImpl: BookingRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<ProviderFetchBookingAppointmentsResProps> {
        if(!providerId) throw new Error("Invalid request");
        
        const provider = await this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found");

        const appointments = await this.bookingRepositoryImpl.findAllBookingAppointmentsUsingProviderId(new Types.ObjectId(providerId));
        if(!appointments) throw new Error("Appointments fetching error");

        return { success: true, message: "Provider booking appointments fetched", bookingAppointments : appointments }
    }
}