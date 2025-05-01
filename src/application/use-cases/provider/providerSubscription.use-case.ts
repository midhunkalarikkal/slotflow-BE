import { Types } from "mongoose";
import { ProviderFetchProviderSubscriptionsResProps } from "../../../shared/interface/providerInterface";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../../infrastructure/database/subscription/subscription.repository.impl";


export class ProviderFetchAllSubscriptionsUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private subscriptionRepository: SubscriptionRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<ProviderFetchProviderSubscriptionsResProps> {
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("Invalid request.");

        const providerSubscriptions = await this.subscriptionRepository.findSubscriptionsByProviderId(new Types.ObjectId(providerId));
        if(!providerSubscriptions) throw new Error("Subscriptions fetching error.");

        return { success: true, message: "Fetched all subscriptions.", subscriptions: providerSubscriptions};
    }
}