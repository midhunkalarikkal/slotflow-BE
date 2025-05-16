import { Validator } from "../../infrastructure/validator/validator";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchAllPaymentUseCaseRequestPayload, ProviderFetchAllPaymentUseCaseResponse } from "../../infrastructure/dtos/provider.dto";


export class ProviderFetchAllPaymentsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) { }

    async execute(data: ProviderFetchAllPaymentUseCaseRequestPayload): Promise<ProviderFetchAllPaymentUseCaseResponse> {
        const { providerId } = data;
        if(!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(!provider) throw new Error("No user found.");

        const payments = await this.paymentRepositoryImpl.findAllPaymentsByProviderId(providerId);
        if(!payments) throw new Error("Payments fetching error.");

        return { success: true, message: "Fetched all payments", payments};
    }
}