import { Types } from "mongoose";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { FindAllSubscriptionsResProps, findSubscriptionFullDetailsResProps } from "../../../domain/repositories/ISubscription.repository";
import { SubscriptionRepositoryImpl } from "../../../infrastructure/database/subscription/subscription.repository.impl";

interface AdminFetchAllSubscriptionsResProps extends CommonResponse {
    subscriptions: Array<FindAllSubscriptionsResProps>
}

interface AdminFetchSubscriptionDetailsResProps extends CommonResponse {
    subscriptionDetails: findSubscriptionFullDetailsResProps | {};
}

export class AdminFetchAllSubscriptionsUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepositoryImpl,
    ) { }

    async execute(): Promise<AdminFetchAllSubscriptionsResProps> {
        const subscriptions = await this.subscriptionRepository.findAllSubscriptions();
        if(!subscriptions) throw new Error("Subscriptions fetching error");
        return { success: true, message: "Subscriptions fetched", subscriptions };
    }
}

export class AdminFetchSubscriptionDetailsUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepositoryImpl,
    ) { }

    async execute(subscriptionId: string): Promise<AdminFetchSubscriptionDetailsResProps> {
        if(!subscriptionId) throw new Error("Invalid request.");
        const subscriptionDetails = await this.subscriptionRepository.findSubscriptionFullDetails(new Types.ObjectId(subscriptionId));
        if (Object.keys(subscriptionDetails).length === 0) return { success: true, message: "Subscription details not found.", subscriptionDetails : {}};
        return { success: true, message: "Subscription details fetched successfully.", subscriptionDetails};
    }
}