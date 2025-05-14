import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderFetchAllPaymentsUseCase } from "../../application/provider-use.case/providerPayment.use-case";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const paymentRepositoryImpl = new PaymentRepositoryImpl();
const providerFetchAllPaymentsUseCase = new ProviderFetchAllPaymentsUseCase( providerRepositoryImpl,paymentRepositoryImpl )

export class ProviderPaymentController {
    constructor(
        private providerFetchAllPaymentsUseCase: ProviderFetchAllPaymentsUseCase
    ) {
        this.getPayments = this.getPayments.bind(this);
    }

    async getPayments(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid requeest.");
            const result = await this.providerFetchAllPaymentsUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error) {
            HandleError.handle(error,res);
        }
    }
}

const providerPaymentController = new ProviderPaymentController( providerFetchAllPaymentsUseCase );
export { providerPaymentController };