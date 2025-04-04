import { Payment } from "../../../domain/entities/payment.entity";
import { PaymentRepositoryImpl } from "../../../infrastructure/database/payment/payment.repository.impl";
import { CommonResponse } from "../../../shared/interface/commonInterface";

type FetchAllPayments = Pick<Payment, "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod">;
interface AdminFetchAllPaymentsResProps extends CommonResponse {
    payments: Array<FetchAllPayments>
}

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