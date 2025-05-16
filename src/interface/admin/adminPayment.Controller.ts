import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { AdminFetchAllPaymentsUseCase } from "../../application/admin-use.case/adminPayment.use-case";

const paymentRepositoryImpl = new PaymentRepositoryImpl();

const adminFetchAllPaymentsUseCase = new AdminFetchAllPaymentsUseCase(paymentRepositoryImpl);

export class AdminPaymentController {
    constructor(
        private adminFetchAllPaymentsUseCase: AdminFetchAllPaymentsUseCase,
    ) {
        this.getAllPayments = this.getAllPayments.bind(this);
    }

    async getAllPayments(req: Request, res: Response) {
        try{
            const result = await this.adminFetchAllPaymentsUseCase.execute();
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error,res);
        }
    }
}

const adminPaymentController = new AdminPaymentController( adminFetchAllPaymentsUseCase );
export { adminPaymentController };