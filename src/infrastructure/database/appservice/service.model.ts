import mongoose, { Document, Schema, Types } from "mongoose";

export interface IService extends Document {
    _id: Types.ObjectId;
    serviceName: string;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
    serviceName: { type: String, required: true, minlength: 4, maxlength: 25, trim: true},
    isBlocked: { type: Boolean, default: false }
},{
    timestamps: true
});

export const ServiceModel = mongoose.model<IService>('Service',serviceSchema);