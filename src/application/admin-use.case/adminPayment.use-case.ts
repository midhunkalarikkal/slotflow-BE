import { AdminFetchAllPayments } from "../../infrastructure/dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

export class AdminFetchAllPaymentsUseCase {
    constructor(
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) {}

    async execute({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
        const result = await this.paymentRepositoryImpl.findAllPayments({ page, limit });
        if (!result) throw new Error("Payments fetching failed");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}