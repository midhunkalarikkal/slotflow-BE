import { Validator } from "../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ApiResponse, FetchPaymentResponse, FetchPaymentsRequest } from "../../infrastructure/dtos/common.dto";


export class UserFetchAllPaymentsUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) { }

 async execute({userId, page, limit}: FetchPaymentsRequest): Promise<ApiResponse<FetchPaymentResponse>> {
        if (!userId) throw new Error("Invalid request");

        Validator.validateObjectId(userId, "userId");

        const provider = await this.userRepositoryImpl.findUserById(userId);
        if (!provider) throw new Error("No user found.");

        const result = await this.paymentRepositoryImpl.findAllPayments({page, limit, userId: userId});
        if (!result) throw new Error("Payments fetching error.");

        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}
