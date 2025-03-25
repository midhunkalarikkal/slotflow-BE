import mongoose, { Document, Schema, Types } from "mongoose";
import { Availability } from "../../../domain/entities/serviceAvailability.entity";

export interface IServiceAvailability extends Document {
    _id: Types.ObjectId,
    providerId: Types.ObjectId,
    availability: Availability[],
    createdAt: Date,
    updatedAt: Date,
}


const serviceAvailabilitySchema = new Schema<IServiceAvailability>({
    providerId : { type: Schema.Types.ObjectId, required: true },
    availability: [
        {
            day: { type: String, required: true },
            duration: { type: String, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            modes: { type: [String], required: true, enum: ["online","offline"]},
            slots: [
                {
                  slot: { type: String, required: true },
                  available: { type: Boolean, required: true, default: true },
                },
              ],
        }
    ]
},{
    timestamps: true, 
});

export const ServiceAvailabilityModel = mongoose.model<IServiceAvailability>('ServiceAvailability', serviceAvailabilitySchema)