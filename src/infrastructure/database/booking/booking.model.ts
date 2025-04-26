import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
    _id: Types.ObjectId,
    serviceProviderId: Types.ObjectId,
    userId: Types.ObjectId,
    appointmentDate: Date,
    appointmentTime: string,
    appointmentMode: string,
    appointmentDay: string,
    appointmentStatus: "Booked" | "Completed" | "Cancelled" | "Rejected",
    paymentId: Types.ObjectId | null,
    createdAt: Date,
    updatedAt: Date,
}

const BookingSchema = new Schema<IBooking>({
    serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    appointmentMode: { type: String, required: true },
    appointmentDay: { type: String, required: true },
    appointmentStatus: { type: String, enum: ["Booked", "Completed", "Cancelled", "Rejected"], required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
}, {
    timestamps: true
});

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);