import { ISubscription, SubscriptionModel } from "./subscription.model";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { CreateSubscriptionPayloadProps, ISubscriptionRepository } from "../../../domain/repositories/ISubscription.repository";

export class SubscriptionRepositoryImpl implements ISubscriptionRepository {
    private mapToEntity(subscription: ISubscription): Subscription {
        return new Subscription(
            subscription._id,
            subscription.providerId,
            subscription.subscriptionPlanId,
            subscription.startDate,
            subscription.endDate,
            subscription.paymentStatus,
            subscription.paymentMethod,
            subscription.transactionId,
            subscription.subscriptionStatus,
            subscription.createdAt,
            subscription.updatedAt,
        )
    }

    async createSubscription(subscription: CreateSubscriptionPayloadProps): Promise<Subscription | null> {
        try{
            const newSubscription = await SubscriptionModel.create(subscription);
            return newSubscription ? this.mapToEntity(newSubscription) : null;
        }catch(error){
            throw new Error("Subscription creating error.");
        }
    }
}