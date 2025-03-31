import { ISubscription, SubscriptionModel } from "./subscription.model";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { CreateSubscriptionPayloadProps, ISubscriptionRepository } from "../../../domain/repositories/ISubscription.repository";
import { Types } from "mongoose";

export class SubscriptionRepositoryImpl implements ISubscriptionRepository {
    private mapToEntity(subscription: ISubscription): Subscription {
        return new Subscription(
            subscription._id,
            subscription.providerId,
            subscription.subscriptionPlanId,
            subscription.subscriptionDurationInDays,
            subscription.startDate,
            subscription.endDate,
            subscription.subscriptionStatus,
            subscription.paymentId,
            subscription.createdAt,
            subscription.updatedAt,
        )
    }

    async createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session?: any} = {}): Promise<Subscription | null> {
        try{
            const newSubscription = await SubscriptionModel.create([subscription], options);
            return newSubscription ? this.mapToEntity(newSubscription[0]) : null;
        }catch(error){
            console.log("Subscription creation catch block error : ",error);
            throw new Error("Subscription creating error.");
        }
    }

    async findSubscriptionById(subscriptionId: Types.ObjectId): Promise<Subscription | null> {
        try{
            console.log("Here is the call")
            const subscription = await SubscriptionModel.findById(subscriptionId);
            console.log("subscription from implementation : ",subscription);
            return subscription ?  this.mapToEntity(subscription) : null;
        }catch(error) {
            throw new Error("Subscription finding error.");
        }
    }
}