import { Types } from "mongoose";

export enum BillingCycle {
    Monthly = "monthly",
    Yearly = "yearly",
}

export class Plan {
    constructor(
        public planName: string,
        public description: string,
        public price: number,
        public features: string[],
        public billingCycle: BillingCycle,
        public maxBookingPerMonth: number,
        public adVisibility: boolean,
        public isBlocked: boolean,
        public _id?: Types.ObjectId,
    ){}
}