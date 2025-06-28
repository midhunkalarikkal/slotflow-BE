import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";
import { Payment } from "../entities/payment.entity";
import { Subscription } from "../entities/subscription.entity";
import { AdminFetchAllSubscriptionsResponse } from "../../infrastructure/dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse, FetchProviderSubscriptionsRequest, FindSubscriptionsByProviderIdResponse } from "../../infrastructure/dtos/common.dto";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "subscriptionStatus" | "paymentId" >;

type FindAllSubscriptions= Pick<Subscription, "_id" | "createdAt" | "providerId" | "startDate" | "endDate" | "subscriptionStatus">;
export type FindAllSubscriptionsResProps = FindAllSubscriptions & Partial<Pick<Plan, "planName" | "price">>;

type SubscriptionProps = Pick<Subscription, "startDate" | "endDate" | "subscriptionStatus" | "createdAt">;
type PaymentsProps = Pick<Payment, "transactionId" | "discountAmount" | "initialAmount" | "paymentFor" | "paymentGateway" | "paymentMethod" | "paymentStatus" | "totalAmount">;
type PlanProps = Pick<Plan, "planName" | "price" | "adVisibility" | "maxBookingPerMonth">;
export interface findSubscriptionFullDetailsResProps extends SubscriptionProps {
    subscriptionPlanId: PlanProps,
    paymentId: PaymentsProps,
}

export interface ISubscriptionRepository {

    createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session: any }): Promise<Subscription>;

    findSubscriptionById(subscriptionId: Types.ObjectId): Promise<Subscription | null>;

    findSubscriptionsByProviderId(data: FetchProviderSubscriptionsRequest): Promise<ApiResponse<FindSubscriptionsByProviderIdResponse>>;

    findAllSubscriptions({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllSubscriptionsResponse>>

    findSubscriptionFullDetails(subscriptionId: Types.ObjectId): Promise<findSubscriptionFullDetailsResProps | {}>;
}
