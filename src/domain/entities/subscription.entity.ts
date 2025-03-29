import { Types } from "mongoose";

export enum PaymentStatus {
    Cancelled = "Cancelled",
    Pending = "Pending",
    Paid = "Paid",
}

export enum SubscriptionStatus {
    Active = "Active",
    Expired = "Expired",
    Cancelled = "Cancelled",
}

export enum PaymentMethod {
    Card = "Card",
    UPI = "UPI",
    Wallet = "Wallet",
    NetBanking = "NetBanking"   
}

export class Subscription {
    constructor(
        public _id: Types.ObjectId,
        public providerId: Types.ObjectId,
        public subscriptionPlanId: Types.ObjectId,
        public startDate: Date,
        public endDate: Date,
        public paymentStatus: PaymentStatus,
        public paymentMethod: PaymentMethod,
        public transactionId: string,
        public subscriptionStatus: SubscriptionStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}