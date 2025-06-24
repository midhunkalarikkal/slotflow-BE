import mongoose, { Document, Schema, Types } from "mongoose";
import { AppointmentStatus } from "../../../domain/entities/booking.entity";

export interface IBooking extends Document {
    _id: Types.ObjectId,
    serviceProviderId: Types.ObjectId,
    userId: Types.ObjectId,
    appointmentDate: Date,
    appointmentTime: string,
    appointmentMode: string,
    appointmentStatus: AppointmentStatus,
    slotId: Types.ObjectId,
    paymentId: Types.ObjectId | null,
    createdAt: Date,
    updatedAt: Date,
}

const BookingSchema = new Schema<IBooking>({
    serviceProviderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Provider", 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    appointmentDate: { 
        type: Date, 
        required: true 
    },
    appointmentTime: { 
        type: String, 
        required: true 
    },
    appointmentMode: { 
        type: String, 
        required: true 
    },
    appointmentStatus: { 
        type: String, 
        enum: Object.values(AppointmentStatus), 
        required: true 
    },
    slotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ServiceAvailability.slots", 
        required: true 
    },
    paymentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Payment" 
    },
}, {
    timestamps: true
});

BookingSchema.index({ appointmentDate: 1, slotId: 1, serviceProviderId: 1 })

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);