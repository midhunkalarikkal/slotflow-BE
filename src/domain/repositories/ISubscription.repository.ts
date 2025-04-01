import { Types } from "mongoose";
import { Subscription } from "../entities/subscription.entity";
import { Plan } from "../entities/plan.entity";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "subscriptionStatus" | "paymentId" | "subscriptionDurationInDays">;

type SubscripionsResProps = Pick<Subscription, | "startDate" | "endDate" | "subscriptionStatus" | "subscriptionDurationInDays">;
export interface FindSubscriptionsByProviderIdResProps extends SubscripionsResProps , Partial<Plan>{
}

export interface ISubscriptionRepository {

    createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session: any }): Promise<Subscription | null>;

    findSubscriptionById(subscriptionId: Types.ObjectId): Promise<Subscription | null>;

    findSubscriptionsByProviderId(providerId: Types.ObjectId): Promise<FindSubscriptionsByProviderIdResProps[] | null>;
}