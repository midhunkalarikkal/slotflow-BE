import { Plan } from "../../domain/entities/plan.entity";
import { User } from "../../domain/entities/user.entity";
import { Address } from "../../domain/entities/address.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Booking } from "../../domain/entities/booking.entity";
import { Service } from "../../domain/entities/service.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";

// **** 1. Used as the request interface for the paginated request
export interface ApiPaginationRequest {
    page: number;
    limit: number;
}


// **** 2. Used as the response interface for the all request
export interface CommonResponse {
  success?: boolean;
  message?: string;
};


// **** 3. Used as the response interface for the paginated response
export interface ApiResponse<T = unknown> extends CommonResponse{
    totalPages?: number;
    currentPage?: number;
    totalCount?: number;
    data?: T;
}


//// **** 4.1 Used as the request interface for fetching subscriptions with planName and plan price of a specific provider for the provider side and admin side
export interface FetchProviderSubscriptionsRequest extends ApiPaginationRequest {
  providerId: Provider["_id"];
}
//// **** 4.2 Used as the response type for fetching subscriptions with planName and plan price of a specific provider for the provider side and admin side
export type FindSubscriptionsByProviderIdResponse = Array<
  Pick<Subscription, "_id" | "startDate" | "endDate" | "subscriptionStatus"> &
  Pick<Plan, "planName" | "price">>;
export type PopulatedSubscription = Omit<Subscription, 'subscriptionPlanId'> & {
  subscriptionPlanId: {
    planName: string;
    price: number;
  }
};



//// **** 5. Used as the request type for adding address for user or provider
export type AddAddressRequest = Pick<Address, "userId" | "addressLine" | "place" | "phone" | "city" | "country" | "district" | "pincode" | "state" | "googleMapLink">;


//// **** 6.1 Used as the request interface fetching payments for admin, provider and user side
export interface userIdAndProviderId {
  userId?: User["_id"];
  providerId?: Provider["_id"];
}
export interface FetchPaymentsRequest extends ApiPaginationRequest, userIdAndProviderId {}
//// **** 6.1 Used as the response type fetching payments for admin, provider and user side
export type FetchPaymentResponse = Array<Pick<Payment, "_id" | "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod" | "discountAmount">>;



//// **** 7.1 Used as the request interface for fetching bookings for admin, provider and user side
export interface userIdAndServiceProviderId {
  userId?: User["_id"];
  serviceProviderId?: Provider["_id"];
}
export interface FetchBookingsRequest extends ApiPaginationRequest, userIdAndServiceProviderId {}
//// **** 7.2 Used as the response type for fetching bookings for admin, provider and user side
export type FetchBookingsResponse = Array<Pick<Booking, "_id" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" >>;


//// **** 8. Used as the response type for fetching AppServices for provider and user side
export type FetchAllAppServicesResponse = Array<Pick<Service, "_id" | "serviceName">>;

