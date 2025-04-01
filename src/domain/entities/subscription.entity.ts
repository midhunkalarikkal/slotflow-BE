import { Types } from "mongoose";

export class Subscription {
    constructor(
        public _id: Types.ObjectId,
        public providerId: Types.ObjectId,
        public subscriptionPlanId: Types.ObjectId,
        public startDate: Date,
        public endDate: Date,
        public subscriptionStatus: string,
        public paymentId: Types.ObjectId | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}