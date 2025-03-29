import { Subscription } from "../entities/subscription.entity";

export type CreateSubscriptionPayloadProps = Pick<Subscription, "providerId" | "subscriptionPlanId" | "startDate" | "endDate" | "transactionId" | "paymentMethod" | "paymentStatus" | "subscriptionStatus">;

export interface ISubscriptionRepository {
    
    createSubscription(subscription: CreateSubscriptionPayloadProps): Promise<Subscription | null>;
    
}