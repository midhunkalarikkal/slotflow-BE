import { Types } from "mongoose";
import { ISubscription, SubscriptionModel } from "./subscription.model";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { CreateSubscriptionPayloadProps, FindAllSubscriptionsResProps, findSubscriptionFullDetailsResProps, FindSubscriptionsByProviderIdResProps, ISubscriptionRepository } from "../../../domain/repositories/ISubscription.repository";

export class SubscriptionRepositoryImpl implements ISubscriptionRepository {
    private mapToEntity(subscription: ISubscription): Subscription {
        return new Subscription(
            subscription._id,
            subscription.providerId,
            subscription.subscriptionPlanId,
            subscription.startDate,
            subscription.endDate,
            subscription.subscriptionStatus,
            subscription.paymentId,
            subscription.createdAt,
            subscription.updatedAt,
        )
    }

    async createSubscription(subscription: CreateSubscriptionPayloadProps, options: { session?: any } = {}): Promise<Subscription> {
        try {
            const newSubscription = await SubscriptionModel.create([subscription], options);
            return this.mapToEntity(newSubscription[0]);
        } catch (error) {
            throw new Error("Subscription creating error.");
        }
    }

    async findSubscriptionById(subscriptionId: Types.ObjectId): Promise<Subscription | null> {
        try {
            const subscription = await SubscriptionModel.findById(subscriptionId);
            return subscription ? this.mapToEntity(subscription) : null;
        } catch (error) {
            throw new Error("Subscription finding error.");
        }
    }

    async findSubscriptionsByProviderId(providerId: Types.ObjectId): Promise<Array<FindSubscriptionsByProviderIdResProps> | []> {
        try {
            const subscriptions = await SubscriptionModel.find({ providerId: providerId }, { _id: 0, subscriptionDurationInDays: 1, startDate: 1, endDate: 1, subscriptionStatus: 1 }).populate({
                path: "subscriptionPlanId",
                select: "planName -_id"
            }).lean();
            return subscriptions;
        } catch (error) {
            throw new Error("Subscriptions fetching error.");
        }
    }

    async findAllSubscriptions(): Promise<Array<FindAllSubscriptionsResProps> | []> {
        try{
            const subscriptions = await SubscriptionModel.find({})
            .select("_id createdAt providerId startDate endDate subscriptionStatus")
            .populate({
                path: "subscriptionPlanId",
                select: "planName price -_id",
            })
            .lean();            
            return subscriptions;
        }catch (error) {
            throw new Error("Subcriptions fetching error.");
        }
    }

    async findSubscriptionFullDetails(subscriptionId: Types.ObjectId): Promise<findSubscriptionFullDetailsResProps | {}> {
        try{    
            const subscriptionDetails = await SubscriptionModel.findById(subscriptionId)
            .select("startDate endDate subscriptionStatus createdAt -_id")
            .populate([{
                path: "paymentId",
                select: "-_id transactionId discountAmount initialAmount totalAmount paymentFor paymentGateway paymentMethod paymentStatus"
            },{
                path: "subscriptionPlanId",
                select: "-_id planName price adVisibility maxBookingPerMonth"
            }]).lean();
            return subscriptionDetails || {};
        }catch (error){
            throw new Error("Subscription details fetching error.");
        }
    }
}