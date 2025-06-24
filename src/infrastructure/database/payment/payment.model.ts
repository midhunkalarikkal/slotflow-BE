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
    transactionId: {
        type: String,
        required: [true, "Transaction ID is required"],
        unique: true,
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ["Cancelled", "Pending", "Paid", "Unpaid"],
            message: "Payment status must be one of: Cancelled, Pending, Paid, or Unpaid",
        },
        required: [true, "Payment status is required"],
    },
    paymentMethod: {
        type: String,
        enum: {
            values: ["card", "upi", "wallet", "netbanking"],
            message: "Payment method must be one of: card, upi, wallet, or netbanking",
        },
        required: [true, "Payment method is required"],
    },
    paymentGateway: {
        type: String,
        enum: {
            values: ["Stripe", "Paypal", "Razorpay"],
            message: "Payment gateway must be one of: Stripe, Paypal, or Razorpay",
        },
        required: [true, "Payment gateway is required"],
    },
    paymentFor: {
        type: String,
        enum: {
            values: ["Provider Subscription", "Appointment Booking", "Provider Payout"],
            message: "Payment purpose must be one of: Provider Subscription, Appointment Booking, or Provider Payout",
        },
        required: [true, "Payment purpose is required"],
    },
    initialAmount: {
        type: Number,
        required: [true, "Initial amount is required"],
        min: [0, "Initial amount cannot be negative"],
        max: [1000000,"Inital amount cannot be more than 1000000"],
    },
    discountAmount: {
        type: Number,
        required: [true, "Discount amount is required"],
        min: [0, "Discount amount cannot be negative"],
        max: [1000000,"Discount amount cannot be more than 1000000"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"],
        max: [1000000,"Total amount cannot be more than 1000000"],
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
    },
    providerId: {
        type: mongoose.Types.ObjectId,
        ref: "Provider",
        required: false,
    },
    refundId: {
        type: String,
    },
    refundAmount: {
        type: Number,
    },
    refundStatus: {
        type: String,
        enum: {
            values: ["succeeded", "pending", "failed"],
            message: "Refund status must be one of: succeeded, pending, or failed",
        },
    },
    refundAt: {
        type: Date
    },
    refundReason: {
        type: String
    },
    chargeId: {
        type: String
    },
},
    { timestamps: true });

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);