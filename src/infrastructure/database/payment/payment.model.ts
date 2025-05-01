import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPayment extends Document {
    _id: Types.ObjectId;
    transactionId: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentGateway: string;
    paymentFor: string;
    initialAmount: number;
    discountAmount: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;

    userId?: Types.ObjectId;
    providerId?: Types.ObjectId;

    refundId?: string;
    refundAmount?: number;
    refundStatus?: string;
    refundAt?: Date;
    refundReason?: string;
    chargeId?: string;
}

const PaymentSchema = new Schema<IPayment>({
    transactionId: { type: String, required: true, unique: true },
    paymentStatus: {
        type: String,
        enum: ["Cancelled", "Pending", "Paid", "Unpaid"],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["card", "upi", "wallet", "netbanking"],
        required: true
    },
    paymentGateway: {
        type: String,
        enum: ["Stripe", "Paypal", "Razorpay"],
        required: true
    },
    paymentFor: {
        type: String,
        enum: ["Provider Subscription", "Appointment Booking", "Provider Payout"],
        required: true
    },
    initialAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    userId: { type: Types.ObjectId, ref: "User", required: false },
    providerId: { type: Types.ObjectId, ref: "Provider", required: false },

    refundId: { type: String },
    refundAmount: { type: Number },
    refundStatus: {
        type: String,
        enum: ["succeeded", "pending", "failed"]
    },
    refundAt: { type: Date },
    refundReason: { type: String },
    chargeId: { type: String },
},
    { timestamps: true });

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);