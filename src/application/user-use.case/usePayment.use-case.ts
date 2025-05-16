import { Validator } from "../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { 
    UserFetchAllPaymentsUseCaseRequestPayload, 
    UserFetchAllPaymentsUseCaseResponse 
} from "../../infrastructure/dtos/user.dto";


export class UserFetchAllPaymentsUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) { }

    async execute(data: UserFetchAllPaymentsUseCaseRequestPayload): Promise<UserFetchAllPaymentsUseCaseResponse> {
        const { userId } = data;
        if (!userId) throw new Error("Invalid request");

        Validator.validateObjectId(userId, "userId");

        const provider = await this.userRepositoryImpl.findUserById(userId);
        if (!provider) throw new Error("No user found.");

        const payments = await this.paymentRepositoryImpl.findAllPaymentsByUserId(userId);
        if (!payments) throw new Error("Payments fetching error.");

        return { success: true, message: "Payments fetched", payments };
    }
}