import { Types } from "mongoose";
import { PaymentRepositoryImpl } from "../../../infrastructure/database/payment/payment.repository.impl";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { UserFetchAllPaymentsResponseProps } from "../../../shared/interface/userInterface";

export class UserFetchAllPaymentsUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private paymentRepository: PaymentRepositoryImpl,
    ) { }

    async execute(userId: string): Promise<UserFetchAllPaymentsResponseProps> {
        if (!userId) throw new Error("Invalid request");

        const provider = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if (!provider) throw new Error("No user found.");

        const payments = await this.paymentRepository.findAllPaymentsByUserId(new Types.ObjectId(userId));
        if (!payments) throw new Error("Payments fetching error.");

        return { success: true, message: "Payments fetched", payments };
    }
}