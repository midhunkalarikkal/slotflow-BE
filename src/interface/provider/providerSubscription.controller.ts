import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";

import { ProviderSubscribeToPlanUseCase } from "../../application/use-cases/provider/providerSubscription.use-case";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";

const planRepositoryImpl = new PlanRepositoryImpl();
const providerSubscribeToPlanUseCase = new ProviderSubscribeToPlanUseCase(planRepositoryImpl);

export class ProviderSubscriptionController {
    constructor(
        private providerSubscribeToPlanUseCase: ProviderSubscribeToPlanUseCase,
    )
    {
        this.subscribe = this.subscribe.bind(this);
    }

    async subscribe(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            console.log("req.body : ",req.body);
            const { planId, planDuration } = req.body;
            if(!providerId || !planId || !planDuration) throw new Error("Invalid request.");
            const result = await this.providerSubscribeToPlanUseCase.execute(providerId, planId, planDuration);
            console.log("Result : ",result);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
};

const providerSubscriptionController = new ProviderSubscriptionController( providerSubscribeToPlanUseCase );
export { providerSubscriptionController };