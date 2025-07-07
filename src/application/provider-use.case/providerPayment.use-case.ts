import { Validator } from "../../infrastructure/validator/validator";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ApiResponse, FetchPaymentResponse, FetchPaymentsRequest } from "../../infrastructure/dtos/common.dto";


export class ProviderFetchAllPaymentsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) { }

    async execute({ providerId, page, limit}: FetchPaymentsRequest): Promise<ApiResponse<FetchPaymentResponse>> {
        
        if(!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(!provider) throw new Error("No user found.");

        const result = await this.paymentRepositoryImpl.findAllPayments({page, limit, providerId: providerId});
        if(!result) throw new Error("Payments fetching error.");

        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}