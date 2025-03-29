import mongoose, { Document, Schema, Types } from "mongoose";
import { PaymentMethod, PaymentStatus, SubscriptionStatus } from "../../../domain/entities/subscription.entity";

export interface ISubscription extends Document {
    _id: Types.ObjectId,
    providerId: Types.ObjectId,
    subscriptionPlanId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    paymentStatus: PaymentStatus,
    paymentMethod: PaymentMethod,
    transactionId: string,
    subscriptionStatus: SubscriptionStatus,
    createdAt: Date,
    updatedAt: Date,
}

const SubscriptionSchema = new Schema<ISubscription>({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    subscriptionPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    startDate: { type: Date, require: true },
    endDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), required: true },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    transactionId: { type: String },
    subscriptionStatus: { type: String, enum: Object.values(SubscriptionStatus), required: true },
},{
    timestamps: true
});

export const SubscriptionModel = mongoose.model<ISubscription>('Subscription',SubscriptionSchema);