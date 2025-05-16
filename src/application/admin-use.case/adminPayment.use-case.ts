import { AdminFetchAllPaymentsUseCaseResponse } from "../../infrastructure/dtos/admin.dto";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

export class AdminFetchAllPaymentsUseCase {
    constructor(
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) {}

    async execute(): Promise<AdminFetchAllPaymentsUseCaseResponse> {
        const payments = await this.paymentRepositoryImpl.findAllPayments();
        if(!payments) throw new Error("Payments fetching error");
        return { success: true, message: "Payments fetched successfully.", payments}
    }
}