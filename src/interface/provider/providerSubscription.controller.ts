import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";

import { ProviderFetchAllSubscriptionsUseCase, ProviderSaveSubscriptionUseCase, ProviderSubscribeToPlanUseCase } from "../../application/use-cases/provider/providerSubscription.use-case";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";

const planRepositoryImpl = new PlanRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const subscriptionRepositoryImpl = new SubscriptionRepositoryImpl();
const paymentRepositoryImpl = new PaymentRepositoryImpl();
const providerSubscribeToPlanUseCase = new ProviderSubscribeToPlanUseCase(planRepositoryImpl, providerRepositoryImpl,subscriptionRepositoryImpl);
const providerSaveSubscriptionUseCase = new ProviderSaveSubscriptionUseCase(providerRepositoryImpl, paymentRepositoryImpl, subscriptionRepositoryImpl);
const providerFetchAllSubscriptionsUseCase = new ProviderFetchAllSubscriptionsUseCase(providerRepositoryImpl, subscriptionRepositoryImpl);

export class ProviderSubscriptionController {
    constructor(
        private providerSubscribeToPlanUseCase: ProviderSubscribeToPlanUseCase,
        private providerSaveSubscriptionUseCase: ProviderSaveSubscriptionUseCase,
        private providerFetchAllSubscriptionsUseCase: ProviderFetchAllSubscriptionsUseCase,
    )
    {
        this.subscribe = this.subscribe.bind(this);
        this.saveSubscription = this.saveSubscription.bind(this);
        this.fetchProviderSubscriptions = this.fetchProviderSubscriptions.bind(this);
    }

    async subscribe(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const { planId, planDuration } = req.body;
            if(!providerId || !planId || !planDuration) throw new Error("Invalid request.");
            const result = await this.providerSubscribeToPlanUseCase.execute(providerId, planId, planDuration);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async saveSubscription(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const { sessionId } = req.body;
            if(!providerId || !sessionId) throw new Error("Invalid request.");
            const result = await this.providerSaveSubscriptionUseCase.execute(providerId, sessionId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async fetchProviderSubscriptions(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchAllSubscriptionsUseCase.execute(providerId);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }
};

const providerSubscriptionController = new ProviderSubscriptionController( providerSubscribeToPlanUseCase, providerSaveSubscriptionUseCase, providerFetchAllSubscriptionsUseCase );
export { providerSubscriptionController };