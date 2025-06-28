import { Plan } from "../../domain/entities/plan.entity";
import { Address } from "../../domain/entities/address.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";

// Common response interface for the usecases
export interface CommonResponse {
    success: boolean;
    message: string;
};

export interface ApiResponse<T = unknown> {
    success?: boolean;
    message?: string;
    totalPages?: number;
    currentPage?: number;
    totalCount?: number;
    data?: T;
}

// Common request interface for the usecases
export interface ApiPaginationRequest {
    page: number;
    limit: number;
}


// Used for fetching subscriptions with planName and plan price of a specific provider for the provider side and admin side
export interface FetchProviderSubscriptionsRequestPayload extends ApiPaginationRequest {
    providerId: Provider["_id"];
}
export type FindSubscriptionsByProviderIdResProps = Array<
  Pick<Subscription, "_id" | "startDate" | "endDate" | "subscriptionStatus"> &
  Pick<Plan, "planName" | "price">>;
export type PopulatedSubscription = Omit<Subscription, 'subscriptionPlanId'> & {
  subscriptionPlanId: {
    planName: string;
    price: number;
  }
};


// Used for adding address for user or provider
export type AddAddressRequest = Pick<Address, "userId" | "addressLine" | "place" | "phone" | "city" | "country" | "district" | "pincode" | "state" | "googleMapLink">;
