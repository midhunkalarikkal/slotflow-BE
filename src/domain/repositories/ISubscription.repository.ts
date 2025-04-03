import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";
import { Subscription } from "../entities/subscription.entity";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "subscriptionStatus" | "paymentId" >;

type FindSubscriptions = Pick<Subscription, | "startDate" | "endDate" | "subscriptionStatus">;
export interface FindSubscriptionsByProviderIdResProps extends FindSubscriptions , Partial<Pick<Plan, "planName">>{
}

type FindAllSubscriptions= Pick<Subscription, "_id" | "createdAt" | "providerId" | "startDate" | "endDate" | "subscriptionStatus">;
export interface FindAllSubscriptionsResProps extends FindAllSubscriptions , Partial<Pick<Plan, "planName" | "price">>{};


export interface ISubscriptionRepository {

    createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session: any }): Promise<Subscription>;

    findSubscriptionById(subscriptionId: Types.ObjectId): Promise<Subscription | null>;

    findSubscriptionsByProviderId(providerId: Types.ObjectId): Promise<Array<FindSubscriptionsByProviderIdResProps> | []>;

    findAllSubscriptions(): Promise<Array<FindAllSubscriptionsResProps> | []>
}