import { Types } from "mongoose";
import { Payment } from "../../../domain/entities/payment.entity";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { PaymentRepositoryImpl } from "../../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";


interface ProviderFetchAllPaymentsResProps extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}


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