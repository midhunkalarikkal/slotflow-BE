import { Types } from "mongoose";

export class Subscription {
    constructor(
        public _id: Types.ObjectId,
        public providerId: Types.ObjectId,
        public subscriptionPlanId: Types.ObjectId,
        public subscriptionDurationInDays: number,
        public startDate: Date,
        public endDate: Date,
        public subscriptionStatus: string,
        public paymentId: Types.ObjectId,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}