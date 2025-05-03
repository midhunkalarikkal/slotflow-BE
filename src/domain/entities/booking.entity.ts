import { Types } from "mongoose";

export class Booking {
    constructor(
        public _id: Types.ObjectId,
        public serviceProviderId: Types.ObjectId,
        public userId: Types.ObjectId,
        public appointmentDate: Date,
        public appointmentTime: string,
        public appointmentMode: string,
        public appointmentDay: string,
        public appointmentStatus: string,
        public slotId: Types.ObjectId,
        public paymentId: Types.ObjectId | null,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}