import { Validator } from "../../infrastructure/validator/validator";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ApiResponse, FetchBookingsRequest, FetchBookingsResponse } from "../../infrastructure/dtos/common.dto";


export class ProviderFetchBookingAppointmentsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private bookingRepositoryImpl: BookingRepositoryImpl,
    ) { }

    async execute({ serviceProviderId, page, limit } : FetchBookingsRequest): Promise<ApiResponse<FetchBookingsResponse>> {

        if(!serviceProviderId) throw new Error("Invalid request");

        Validator.validateObjectId(serviceProviderId, "providerId");
        
        const provider = await this.providerRepositoryImpl.findProviderById(serviceProviderId);
        if(!provider) throw new Error("No user found");

        const result = await this.bookingRepositoryImpl.findAllBookings({page, limit, serviceProviderId});
        if(!result) throw new Error("Appointments fetching error");

        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}