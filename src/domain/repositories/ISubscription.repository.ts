import { Subscription } from "../entities/subscription.entity";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "subscriptionStatus" | "paymentId" | "subscriptionDurationInDays">;

export interface ISubscriptionRepository {
    
    createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session: any }): Promise<Subscription | null>;

}