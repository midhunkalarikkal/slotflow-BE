import { Types } from "mongoose";

export class Payment {
    constructor(
        public _id: Types.ObjectId,
        public transactionId: string, // Stripe payment_intent || razorpay's payment_id || paypals capture_id
        public paymentStatus: string,
        public paymentMethod: string,
        public paymentGateway: string,
        public paymentFor: string,
        public initialAmount: number,
        public discountAmount: number,
        public totalAmount: number,
        public createdAt: Date,
        public updatedAt: Date,  
        
        public userId?: Types.ObjectId,
        public providerId?: Types.ObjectId,

        public refundId?: string,
        public refundAmount?: number,
        public refundStatus?: string,
        public refundAt?: Date,
        public refundReason?: string,
        public chargeId?: string,
    ) { }
}