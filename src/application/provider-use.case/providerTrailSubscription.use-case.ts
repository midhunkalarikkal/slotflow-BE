import dayjs from "dayjs";
import { Types } from "mongoose";
import { ApiResponse } from "../../infrastructure/dtos/common.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { ProviderTrialSubscriptionRequest } from "../../infrastructure/dtos/provider.dto";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";

export class ProviderTrialSubscriptionUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
        private planRepositoryImpl: PlanRepositoryImpl,
    ) { }

    async execute({ providerId }: ProviderTrialSubscriptionRequest): Promise<ApiResponse> {

        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");
        
        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        
        const providerSubscriptions = provider.subscription;
        if(providerSubscriptions.length > 0){
            const providerLastSubscriptionId = providerSubscriptions.pop();
            const subscription = await this.subscriptionRepositoryImpl.findSubscriptionById(new Types.ObjectId(providerLastSubscriptionId));
            const isSubscriptionExpired = dayjs().isAfter(dayjs(subscription?.endDate), "day");
            if(!isSubscriptionExpired) throw new Error("Your current subscription is on live.");
        }

        const trialPlan = await this.planRepositoryImpl.findPlanByNameOrPrice({ planName: "TRIAL", price: 0 })
        if (!trialPlan) throw new Error("No trial plan found.");

        const trialPlanId = trialPlan._id;
        const checkTrialIsAlreadyUsed = providerSubscriptions.includes(trialPlanId);
        if (checkTrialIsAlreadyUsed) throw new Error("You have already used the free trial, please go for the paid plan.");

        const subscription = await this.subscriptionRepositoryImpl.createSubscription({
            providerId: new Types.ObjectId(providerId),
            subscriptionPlanId: new Types.ObjectId(trialPlanId),
            startDate: new Date(),
            endDate: dayjs().add(Number(7), "day").toDate(),
            subscriptionStatus: "Active",
            paymentId: null
        });

        if(!subscription) throw new Error("Trial plan activating error.");

        provider.subscription.push(subscription._id);
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        
        if(!updatedProvider) throw new Error("Trail plan activating error.");

        return { success: true, message: "Your trial plan is on live." };
    }
}