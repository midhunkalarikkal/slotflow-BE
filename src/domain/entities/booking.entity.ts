import { Types } from "mongoose";

export enum AppointmentStatus {
    Booked = "Booked",
    Completed = "Completed",
    Cancelled = "Cancelled",
    Rejected = "Rejected",
}

export class Booking {
    constructor(
        public _id: Types.ObjectId,
        public serviceProviderId: Types.ObjectId,
        public userId: Types.ObjectId,
        public appointmentDate: Date,
        public appointmentTime: string,
        public appointmentMode: string,
        public appointmentStatus: AppointmentStatus,
        public slotId: Types.ObjectId,
        public paymentId: Types.ObjectId | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}