import { Payment } from "../entities/payment.entity";

export type CreatePaymentForSubscriptionProps = Pick<Payment, "transactionId" | "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "initialAmount" | "discountAmount" | "providerId" | "totalAmount" >

export interface IPaymentRepository {

    createPaymentForSubscription(payment: CreatePaymentForSubscriptionProps, options?: { session?: any }): Promise<Payment | null>;

}

