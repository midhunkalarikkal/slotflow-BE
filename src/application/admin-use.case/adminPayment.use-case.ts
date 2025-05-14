import { AdminFetchAllPaymentsResProps } from "../../infrastructure/dtos/admin.dto";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

export class AdminFetchAllPaymentsUseCase {
    constructor(
        private paymentRepository: PaymentRepositoryImpl,
    ) {}

    async execute(): Promise<AdminFetchAllPaymentsResProps> {
        const payments = await this.paymentRepository.findAllPayments();
        if(!payments) throw new Error("Payments fetching error");
        return { success: true, message: "Payments fetched successfully.", payments}
    }
}