import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";
import { Subscription } from "../entities/subscription.entity";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "subscriptionStatus" | "paymentId" >;

type SubscripionsResProps = Pick<Subscription, | "startDate" | "endDate" | "subscriptionStatus">;
export interface FindSubscriptionsByProviderIdResProps extends SubscripionsResProps , Partial<Pick<Plan, "_id" | "planName">>{
}

export interface ISubscriptionRepository {

    createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session: any }): Promise<Subscription>;

    findSubscriptionById(subscriptionId: Types.ObjectId): Promise<Subscription | null>;

    findSubscriptionsByProviderId(providerId: Types.ObjectId): Promise<Array<FindSubscriptionsByProviderIdResProps>>;
}