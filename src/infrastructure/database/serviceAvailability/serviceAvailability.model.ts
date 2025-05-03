import mongoose, { Document, Schema, Types } from "mongoose";
import { Availability } from "../../../domain/entities/serviceAvailability.entity";

export interface IServiceAvailability extends Document {
    _id: Types.ObjectId,
    providerId: Types.ObjectId,
    availabilities: Availability[],
    createdAt: Date,
    updatedAt: Date,
}

const slotSchema = new Schema({
    time: { type: String, required: true }
  }, { _id: true });
  
  const availabilitySchema = new Schema({
    day: { type: String, required: true },
    duration: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    modes: { type: [String], required: true, enum: ["online", "offline"] },
    slots: [slotSchema]
  }, { _id: true });


const serviceAvailabilitySchema = new Schema<IServiceAvailability>({
    providerId : { type: Schema.Types.ObjectId, ref: "Provider" ,required: true },
    availabilities: [availabilitySchema]
},{
    timestamps: true, 
});

export const ServiceAvailabilityModel = mongoose.model<IServiceAvailability>('ServiceAvailability', serviceAvailabilitySchema)