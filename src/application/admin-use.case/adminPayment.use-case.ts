import { ApiResponse, FetchPaymentResponse, FetchPaymentsRequest } from "../../infrastructure/dtos/common.dto";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

export class AdminFetchAllPaymentsUseCase {
    constructor(
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) {}

    async execute({ page, limit }: FetchPaymentsRequest): Promise<ApiResponse<FetchPaymentResponse>> {
        const result = await this.paymentRepositoryImpl.findAllPayments({ page, limit });
        if (!result) throw new Error("Payments fetching failed");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}