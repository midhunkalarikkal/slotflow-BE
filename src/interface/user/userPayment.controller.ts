import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserFetchAllPaymentsUseCase } from "../../application/use-cases/user/usePayment.use-case";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const paymentRepositoryImpl = new PaymentRepositoryImpl();
const userFetchAllPaymentsUseCase = new UserFetchAllPaymentsUseCase(userRepositoryImpl, paymentRepositoryImpl);

export class UserPaymentController {
    constructor(
        private userFetchAllPaymentsUseCase: UserFetchAllPaymentsUseCase,
    ) { 
        this.fetchPayments = this.fetchPayments.bind(this);
    }

    async fetchPayments(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            if(!userId) throw new Error("Invalid request");
            const result = await this.userFetchAllPaymentsUseCase.execute(userId);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }
    
}

const userPaymentController = new UserPaymentController(userFetchAllPaymentsUseCase);
export { userPaymentController };