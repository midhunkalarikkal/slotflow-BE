import { Plan } from "../../domain/entities/plan.entity";
import { User } from "../../domain/entities/user.entity";
import { Address } from "../../domain/entities/address.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";
import { Booking } from "../../domain/entities/booking.entity";

// Common response interface for the usecases
export interface CommonResponse {
    success?: boolean;
    message?: string;
};

export interface ApiResponse<T = unknown> extends CommonResponse{
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



//// **** Used for fetching subscriptions with planName and plan price of a specific provider for the provider side and admin side
export interface FetchProviderSubscriptionsRequest extends ApiPaginationRequest {
    providerId: Provider["_id"];
}
export type FindSubscriptionsByProviderIdResponse = Array<
  Pick<Subscription, "_id" | "startDate" | "endDate" | "subscriptionStatus"> &
  Pick<Plan, "planName" | "price">>;
export type PopulatedSubscription = Omit<Subscription, 'subscriptionPlanId'> & {
  subscriptionPlanId: {
    planName: string;
    price: number;
  }
};



//// **** Used for adding address for user or provider
export type AddAddressRequest = Pick<Address, "userId" | "addressLine" | "place" | "phone" | "city" | "country" | "district" | "pincode" | "state" | "googleMapLink">;



//// **** Used for payments fetching for admin, provider and user side
export interface userIdAndProviderId {
  userId?: User["_id"];
  providerId?: Provider["_id"];
}
export interface FetchPaymentsRequest extends ApiPaginationRequest, userIdAndProviderId {}
export type FetchPaymentResponse = Array<Pick<Payment, "_id" | "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod" | "discountAmount">>;



//// **** Used for bookings fetching for admin, provider and user side
export interface userIdAndServiceProviderId {
  userId?: User["_id"];
  serviceProviderId?: Provider["_id"];
}
export interface FetchBookingsRequest extends ApiPaginationRequest, userIdAndServiceProviderId {}
export type FetchBookingsResponse = Array<Pick<Booking, "_id" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" >>;
