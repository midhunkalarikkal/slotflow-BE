import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubscription extends Document {
    _id: Types.ObjectId,
    providerId: Types.ObjectId,
    subscriptionPlanId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    subscriptionStatus: string,
    paymentId: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

const SubscriptionSchema = new Schema<ISubscription>({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    subscriptionPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    startDate: { type: Date, require: true },
    endDate: { type: Date, required: true },
    subscriptionStatus: { type: String, enum: ["Active", "Expired", "Cancelled"], required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
},{
    timestamps: true
});

export const SubscriptionModel = mongoose.model<ISubscription>('Subscription',SubscriptionSchema);