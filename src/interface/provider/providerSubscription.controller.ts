import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { RequestQueryCommonZodSchema, SaveStripePaymentZodSchema } from "../../infrastructure/zod/common.zod";
import { ProviderPlanSubscribeZodSchema } from "../../infrastructure/zod/provider.zod";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";
import { ProviderFetchAllSubscriptionsUseCase } from "../../application/provider-use.case/providerSubscription.use-case";
import { ProviderTrialSubscriptionUseCase } from "../../application/provider-use.case/providerTrailSubscription.use-case";
import { ProviderSaveSubscriptionUseCase, ProviderStripeSubscriptionCreateSessionIdUseCase } from "../../application/provider-use.case/providerStripeSubscription.use-case";

const planRepositoryImpl = new PlanRepositoryImpl();
const paymentRepositoryImpl = new PaymentRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const subscriptionRepositoryImpl = new SubscriptionRepositoryImpl();

const providerStripeSubscriptionCreateSessionIdUseCase = new ProviderStripeSubscriptionCreateSessionIdUseCase(planRepositoryImpl, providerRepositoryImpl, subscriptionRepositoryImpl);
const providerSaveSubscriptionUseCase = new ProviderSaveSubscriptionUseCase(providerRepositoryImpl, paymentRepositoryImpl, subscriptionRepositoryImpl);
const providerFetchAllSubscriptionsUseCase = new ProviderFetchAllSubscriptionsUseCase(providerRepositoryImpl, subscriptionRepositoryImpl);
const providerTrialSubscriptionUseCase = new ProviderTrialSubscriptionUseCase(providerRepositoryImpl, subscriptionRepositoryImpl, planRepositoryImpl)

export class ProviderSubscriptionController {
    constructor(
        private providerStripeSubscriptionCreateSessionIdUseCase: ProviderStripeSubscriptionCreateSessionIdUseCase,
        private providerSaveSubscriptionUseCase: ProviderSaveSubscriptionUseCase,
        private providerFetchAllSubscriptionsUseCase: ProviderFetchAllSubscriptionsUseCase,
        private providerTrialSubscriptionUseCase: ProviderTrialSubscriptionUseCase,
    ) {
        this.subscribe = this.subscribe.bind(this);
        this.saveSubscription = this.saveSubscription.bind(this);
        this.fetchProviderSubscriptions = this.fetchProviderSubscriptions.bind(this);
        this.subsribetoTrialPlan = this.subsribetoTrialPlan.bind(this);
    }

    async subscribe(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const validateData = ProviderPlanSubscribeZodSchema.parse(req.body);
            const { planId, planDuration } = validateData;
            if (!providerId || !planId || !planDuration) throw new Error("Invalid request.");
            const result = await this.providerStripeSubscriptionCreateSessionIdUseCase.execute({ providerId: new Types.ObjectId(providerId), planId: new Types.ObjectId(planId), duration: planDuration });
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async saveSubscription(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const validateData = SaveStripePaymentZodSchema.parse(req.body);
            const { sessionId } = validateData;
            if (!providerId || !sessionId) throw new Error("Invalid request.");
            const result = await this.providerSaveSubscriptionUseCase.execute({ providerId: new Types.ObjectId(providerId), sessionId });
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchProviderSubscriptions(req: Request, res: Response) {
        try {
            const validateQueryData = RequestQueryCommonZodSchema.parse(req.query);
            const { page, limit } = validateQueryData;
            const providerId = req.user.userOrProviderId;
            if (!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchAllSubscriptionsUseCase.execute({ providerId: new Types.ObjectId(providerId), page, limit });
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async subsribetoTrialPlan(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            if (!providerId) throw new Error("Invalid request.");
            const result = await this.providerTrialSubscriptionUseCase.execute({ providerId: new Types.ObjectId(providerId) });
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }
};

const providerSubscriptionController = new ProviderSubscriptionController(
    providerStripeSubscriptionCreateSessionIdUseCase,
    providerSaveSubscriptionUseCase,
    providerFetchAllSubscriptionsUseCase,
    providerTrialSubscriptionUseCase
);

export { providerSubscriptionController };