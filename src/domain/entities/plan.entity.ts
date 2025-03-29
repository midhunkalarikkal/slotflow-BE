import { Types } from "mongoose";

export class Plan {
    constructor(
        public _id: Types.ObjectId,
        public planName: string,
        public description: string,
        public price: number,
        public features: string[],
        public maxBookingPerMonth: number,
        public adVisibility: boolean,
        public isBlocked: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}