import { Validator } from "../../infrastructure/validator/validator";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";
import { 
    AdminFetchSubscriptionDetailsResponse, 
    AdminFetchSubscriptionDetailsRequest,
    AdminFetchAllSubscriptionsResponse, 
} from "../../infrastructure/dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";

export class AdminFetchAllSubscriptionsUseCase {
    constructor(
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute({ page, limit}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllSubscriptionsResponse>> {
        const result = await this.subscriptionRepositoryImpl.findAllSubscriptions({ page, limit });
        if (!result) throw new Error("Subscriptions fetching failed, ");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}

export class AdminFetchSubscriptionDetailsUseCase {
    constructor(
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute(data: AdminFetchSubscriptionDetailsRequest): Promise<AdminFetchSubscriptionDetailsResponse> {
        const { subscriptionId } = data;
        if(!subscriptionId) throw new Error("Invalid request.");
        
        Validator.validateObjectId(subscriptionId, "subscriptionId");

        const subscriptionDetails = await this.subscriptionRepositoryImpl.findSubscriptionFullDetails(subscriptionId);
        if (Object.keys(subscriptionDetails).length === 0) return { success: true, message: "Subscription details not found.", subscriptionDetails : {}};
        return { success: true, message: "Subscription details fetched successfully.", subscriptionDetails};
    }
}