import { Types } from "mongoose";
import { Payment } from "../entities/payment.entity";

export type CreatePaymentForSubscriptionProps = Pick<Payment, "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "providerId" | "totalAmount" >;
export type CreatePaymentForBookingProps = Pick<Payment, "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "userId" | "totalAmount" >;
export type FindAllPaymentsByProviderIdResProps = Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">;
export type FindAllPaymentsByUserIdResProps = Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">;
export type FindAllPayments = Pick<Payment, "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod">;
export type UpdateForCancelBookingRefundReqProps = Pick<Payment, "_id" | "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "userId" | "totalAmount" | "refundAmount" | "chargeId" | "refundAt" | "refundId" | "refundReason" | 'refundStatus'>;

export interface IPaymentRepository {

    createPaymentForSubscription(payment: CreatePaymentForSubscriptionProps, options?: { session?: any }): Promise<Payment | null>;
    
    createPaymentForBooking(payment: CreatePaymentForBookingProps, options?: { session?: any }): Promise<Payment | null>;
    
    findAllPaymentsByProviderId(providerId: Types.ObjectId): Promise<Array<FindAllPaymentsByProviderIdResProps> | []>;

    findAllPaymentsByUserId(providerId: Types.ObjectId): Promise<Array<FindAllPaymentsByUserIdResProps> | []>;
    
    findAllPayments(): Promise<Array<FindAllPayments> | []>;
    
    findAllPaymentById(paymentId: Types.ObjectId): Promise<Payment | null>;

    updateForCancelBookingRefund(payment: UpdateForCancelBookingRefundReqProps, options?: { session?: any }): Promise<Payment | null>;

}
