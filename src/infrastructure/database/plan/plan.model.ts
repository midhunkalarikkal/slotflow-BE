import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPlan extends Document {
    _id: Types.ObjectId;
    planName: string;
    description: string
    price: number;
    features: string[];
    maxBookingPerMonth: number;
    adVisibility: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
    planName: { type: String, required: true, minlength: 4, maxlength: 20, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, unique: true },
    features: { type: [String], required: true },
    maxBookingPerMonth: { type: Number, required: true },
    adVisibility: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },      
},{
    timestamps: true
});

export const PlanModel = mongoose.model<IPlan>('Plan',PlanSchema)