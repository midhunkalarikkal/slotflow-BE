import dayjs from "dayjs";
import { Types } from "mongoose";
import { CommonResponse } from "../../infrastructure/dtos/common.dto";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";

export class ProviderTrialSubscriptionUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private subscriptionRepository: SubscriptionRepositoryImpl,
        private planRepository: PlanRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<CommonResponse> {
        console.log("Trial plan")
        if (!providerId) throw new Error("Invalid request.");
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("User not found.");
        
        const providerSubscriptions = provider.subscription;
        if(providerSubscriptions.length > 0){
            const providerLastSubscriptionId = providerSubscriptions.pop();
            const subscription = await this.subscriptionRepository.findSubscriptionById(new Types.ObjectId(providerLastSubscriptionId));
            const isSubscriptionExpired = dayjs().isAfter(dayjs(subscription?.endDate), "day");
            if(!isSubscriptionExpired) throw new Error("Your current subscription is on live.");
        }

        const trialPlan = await this.planRepository.findPlanByNameOrPrice({ planName: "TRIAL", price: 0 })
        if (!trialPlan) throw new Error("No trial plan found.");

        const trialPlanId = trialPlan._id;
        const checkTrialIsAlreadyUsed = providerSubscriptions.includes(trialPlanId);
        if (checkTrialIsAlreadyUsed) throw new Error("You have already used the free trial, please go for the paid plan.");

        const subscription = await this.subscriptionRepository.createSubscription({
            providerId: new Types.ObjectId(providerId),
            subscriptionPlanId: new Types.ObjectId(trialPlanId),
            startDate: new Date(),
            endDate: dayjs().add(Number(7), "day").toDate(),
            subscriptionStatus: "Active",
            paymentId: null
        });

        if(!subscription) throw new Error("Trial plan activating error.");

        provider.subscription.push(subscription._id);
        const updatedProvider = await this.providerRepository.updateProvider(provider);
        
        if(!updatedProvider) throw new Error("Trail plan activating error.");

        return { success: true, message: "Your trial plan is on live." };
    }
}