import { Types } from "mongoose";

export class Booking {
    constructor(
        public _id: Types.ObjectId,
        public serviceProviderId: Types.ObjectId,
        public userId: Types.ObjectId,
        public appointmentTime: string,
        public appointmentMode: string,
        public appointmentDay: string,
        public appointmentStatus: string,
        public paymentId: Types.ObjectId | null,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}