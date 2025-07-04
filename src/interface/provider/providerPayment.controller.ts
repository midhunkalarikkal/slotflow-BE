import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchAllPaymentsUseCase } from "../../application/provider-use.case/providerPayment.use-case";
import { RequestQueryCommonZodSchema } from "../../infrastructure/zod/common.zod";

const paymentRepositoryImpl = new PaymentRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();

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
            const validateQueryData = RequestQueryCommonZodSchema.parse(req.query);
            const { page, limit } = validateQueryData;
            if(!providerId) throw new Error("Invalid requeest.");
            const result = await this.providerFetchAllPaymentsUseCase.execute({providerId: new Types.ObjectId(providerId), page, limit});
            res.status(200).json(result);
        }catch(error) {
            HandleError.handle(error,res);
        }
    }
}

const providerPaymentController = new ProviderPaymentController( providerFetchAllPaymentsUseCase );
export { providerPaymentController };