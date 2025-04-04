import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";
import { Payment } from "../entities/payment.entity";
import { Subscription } from "../entities/subscription.entity";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "subscriptionStatus" | "paymentId" >;

type FindSubscriptions = Pick<Subscription, | "startDate" | "endDate" | "subscriptionStatus">;
export interface FindSubscriptionsByProviderIdResProps extends FindSubscriptions , Partial<Pick<Plan, "planName">>{
}

type FindAllSubscriptions= Pick<Subscription, "_id" | "createdAt" | "providerId" | "startDate" | "endDate" | "subscriptionStatus">;
export interface FindAllSubscriptionsResProps extends FindAllSubscriptions , Partial<Pick<Plan, "planName" | "price">>{};

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

    findSubscriptionsByProviderId(providerId: Types.ObjectId): Promise<Array<FindSubscriptionsByProviderIdResProps> | []>;

    findAllSubscriptions(): Promise<Array<FindAllSubscriptionsResProps> | []>

    findSubscriptionFullDetails(subscriptionId: Types.ObjectId): Promise<findSubscriptionFullDetailsResProps | {}>;
}