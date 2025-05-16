import { Validator } from "../../infrastructure/validator/validator";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchBookingAppointmentsUseCaseRequestPayload, ProviderFetchBookingAppointmentsUseCaseResponse } from "../../infrastructure/dtos/provider.dto";


export class ProviderFetchBookingAppointmentsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private bookingRepositoryImpl: BookingRepositoryImpl,
    ) { }

    async execute(data: ProviderFetchBookingAppointmentsUseCaseRequestPayload): Promise<ProviderFetchBookingAppointmentsUseCaseResponse> {
        const { providerId } = data;
        if(!providerId) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");
        
        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(!provider) throw new Error("No user found");

        const appointments = await this.bookingRepositoryImpl.findAllBookingAppointmentsUsingProviderId(providerId);
        if(!appointments) throw new Error("Appointments fetching error");

        return { success: true, message: "Provider booking appointments fetched", bookingAppointments : appointments }
    }
}