import { Types } from "mongoose";
import { ISubscription, SubscriptionModel } from "./subscription.model";
import { AdminFetchAllSubscriptionsResponse } from "../../dtos/admin.dto";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { CreateSubscriptionPayloadProps, findSubscriptionFullDetailsResProps, ISubscriptionRepository } from "../../../domain/repositories/ISubscription.repository";
import { ApiPaginationRequest, ApiResponse, FetchProviderSubscriptionsRequestPayload, FindSubscriptionsByProviderIdResProps, PopulatedSubscription } from "../../dtos/common.dto";

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

    async findSubscriptionsByProviderId(data: FetchProviderSubscriptionsRequestPayload): Promise<ApiResponse<FindSubscriptionsByProviderIdResProps>> {
        try {
            const { providerId, page, limit } = data;
            const skip = (page - 1) * limit;
            const [subscriptions, totalCount] = await Promise.all([
                SubscriptionModel.find({ providerId: providerId }, {
                    _id: 1,
                    startDate: 1,
                    endDate: 1,
                    subscriptionStatus: 1,
                }).populate<PopulatedSubscription>({
                    path: "subscriptionPlanId",
                    select: "-_id planName price"
                }).skip(skip).limit(limit).lean(),
                SubscriptionModel.countDocuments({ providerId: providerId }),
            ])
            const totalPages = Math.ceil(totalCount / limit);
            return {
                data: subscriptions.map((sub) => ({
                    _id: sub._id,
                    startDate: sub.startDate,
                    endDate: sub.endDate,
                    subscriptionStatus: sub.subscriptionStatus,
                    planName: sub.subscriptionPlanId?.planName,
                    price: sub.subscriptionPlanId?.price,
                })),
                totalPages,
                currentPage: page,
                totalCount
            }
        } catch (error) {
            throw new Error("Subscriptions fetching error.");
        }
    }

    async findAllSubscriptions({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllSubscriptionsResponse>> {
        try {
            const skip = (page - 1) * limit;
            const [subscriptions, totalCount] = await Promise.all([
                SubscriptionModel.find({}, {
                    _id: 1,
                    createdAt: 1,
                    providerId: 1,
                    startDate: 1,
                    endDate: 1,
                    subscriptionStatus: 1,
                }).skip(skip).limit(limit).lean(),
                SubscriptionModel.countDocuments(),
            ])
            const totalPages = Math.ceil(totalCount / limit);
            return {
                data: subscriptions.map(this.mapToEntity),
                totalPages,
                currentPage: page,
                totalCount
            }
        } catch (error) {
            throw new Error("Subcriptions fetching error.");
        }
    }

    async findSubscriptionFullDetails(subscriptionId: Types.ObjectId): Promise<findSubscriptionFullDetailsResProps | {}> {
        try {
            const subscriptionDetails = await SubscriptionModel.findById(subscriptionId)
                .select("startDate endDate subscriptionStatus createdAt -_id")
                .populate([{
                    path: "paymentId",
                    select: "-_id transactionId discountAmount initialAmount totalAmount paymentFor paymentGateway paymentMethod paymentStatus"
                }, {
                    path: "subscriptionPlanId",
                    select: "-_id planName price adVisibility maxBookingPerMonth"
                }]).lean();
            return subscriptionDetails || {};
        } catch (error) {
            throw new Error("Subscription details fetching error.");
        }
    }
}