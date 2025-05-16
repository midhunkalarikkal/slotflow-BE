import { Validator } from "../../infrastructure/validator/validator";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";
import { ProviderFetchProviderSubscriptionsUseCaseRequestPayload, ProviderFetchProviderSubscriptionsUseCaseResponse } from "../../infrastructure/dtos/provider.dto";


export class ProviderFetchAllSubscriptionsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute(data: ProviderFetchProviderSubscriptionsUseCaseRequestPayload): Promise<ProviderFetchProviderSubscriptionsUseCaseResponse> {
        const { providerId } = data;
        if(!providerId) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(!provider) throw new Error("Invalid request.");

        const providerSubscriptions = await this.subscriptionRepositoryImpl.findSubscriptionsByProviderId(providerId);
        if(!providerSubscriptions) throw new Error("Subscriptions fetching error.");

        return { success: true, message: "Fetched all subscriptions.", subscriptions: providerSubscriptions};
    }
}