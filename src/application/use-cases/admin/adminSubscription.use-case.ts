import { Subscription } from "../../../domain/entities/subscription.entity";
import { SubscriptionRepositoryImpl } from "../../../infrastructure/database/subscription/subscription.repository.impl";
import { CommonResponse } from "../../../shared/interface/commonInterface";

type FetchAllSubscriptionsProp = Pick<Subscription, "_id" | "createdAt" | "providerId" | "startDate" | "endDate" | "subscriptionStatus">;
interface AdminFetchAllSubscriptionsResProps extends CommonResponse {
    subscriptions: Array<FetchAllSubscriptionsProp>
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