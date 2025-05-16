import { Validator } from "../../infrastructure/validator/validator";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";
import { 
    AdminFetchAllSubscriptionsUseCaseResponse, 
    AdminFetchSubscriptionDetailsUseCaseResponse, 
    AdminFetchSubscriptionDetailsUseCaseRequestPayload, 
} from "../../infrastructure/dtos/admin.dto";

export class AdminFetchAllSubscriptionsUseCase {
    constructor(
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute(): Promise<AdminFetchAllSubscriptionsUseCaseResponse> {
        const subscriptions = await this.subscriptionRepositoryImpl.findAllSubscriptions();
        if(!subscriptions) throw new Error("Subscriptions fetching error");
        return { success: true, message: "Subscriptions fetched", subscriptions };
    }
}

export class AdminFetchSubscriptionDetailsUseCase {
    constructor(
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute(data: AdminFetchSubscriptionDetailsUseCaseRequestPayload): Promise<AdminFetchSubscriptionDetailsUseCaseResponse> {
        const { subscriptionId } = data;
        if(!subscriptionId) throw new Error("Invalid request.");
        
        Validator.validateObjectId(subscriptionId, "subscriptionId");

        const subscriptionDetails = await this.subscriptionRepositoryImpl.findSubscriptionFullDetails(subscriptionId);
        if (Object.keys(subscriptionDetails).length === 0) return { success: true, message: "Subscription details not found.", subscriptionDetails : {}};
        return { success: true, message: "Subscription details fetched successfully.", subscriptionDetails};
    }
}