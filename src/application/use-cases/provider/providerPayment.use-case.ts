import { Types } from "mongoose";
import { ProviderFetchAllPaymentsResProps } from "../../../shared/interface/providerInterface";
import { PaymentRepositoryImpl } from "../../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";


export class ProviderFetchAllPaymentsUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private paymentRepository: PaymentRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<ProviderFetchAllPaymentsResProps> {
        if(!providerId) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found.");

        const payments = await this.paymentRepository.findAllPaymentsByProviderId(new Types.ObjectId(providerId));
        if(!payments) throw new Error("Payments fetching error.");

        return { success: true, message: "Fetched all payments", payments};
    }
}