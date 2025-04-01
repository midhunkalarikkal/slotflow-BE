import { Types } from "mongoose";
import { Payment } from "../entities/payment.entity";

export type CreatePaymentForSubscriptionProps = Pick<Payment, "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "providerId" | "totalAmount" >;
export type FindAllPaymentsResProps = Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">;

export interface IPaymentRepository {

    createPaymentForSubscription(payment: CreatePaymentForSubscriptionProps, options?: { session?: any }): Promise<Payment | null>;

    findAllPaymentsByProviderId(providerId: Types.ObjectId): Promise<FindAllPaymentsResProps[] | null>

}

