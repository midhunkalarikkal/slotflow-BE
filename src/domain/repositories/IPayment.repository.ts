import { Types } from "mongoose";
import { Payment } from "../entities/payment.entity";
import { ApiResponse, FetchPaymentResponse, FetchPaymentsRequest } from "../../infrastructure/dtos/common.dto";

export type CreatePaymentForSubscriptionProps = Pick<Payment, "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "providerId" | "totalAmount" >;
export type CreatePaymentForBookingProps = Pick<Payment, "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "userId" | "totalAmount" >;
export type UpdateForCancelBookingRefundReqProps = Pick<Payment, "_id" | "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "userId" | "totalAmount" | "refundAmount" | "chargeId" | "refundAt" | "refundId" | "refundReason" | 'refundStatus'>;

export interface IPaymentRepository {

    createPaymentForSubscription(payment: CreatePaymentForSubscriptionProps, options?: { session?: any }): Promise<Payment | null>;
    
    createPaymentForBooking(payment: CreatePaymentForBookingProps, options?: { session?: any }): Promise<Payment | null>;
    
    findAllPayments({ page, limit, userId, providerId }: FetchPaymentsRequest): Promise<ApiResponse<FetchPaymentResponse>>;
    
    findPaymentById(paymentId: Types.ObjectId): Promise<Payment | null>;

    updateForCancelBookingRefund(payment: UpdateForCancelBookingRefundReqProps, options?: { session?: any }): Promise<Payment | null>;

}
