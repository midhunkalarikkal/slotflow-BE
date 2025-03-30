import { Payment } from "../../../domain/entities/payment.entity";
import { CreatePaymentForSubscriptionProps, IPaymentRepository } from "../../../domain/repositories/IPayment.repository";
import { IPayment, PaymentModel } from "./payment.model";

export class PaymentRepositoryImpl implements IPaymentRepository {
    private mapToEntity(payment: IPayment): Payment {
        return new Payment(
            payment._id,
            payment.transactionId,
            payment.paymentStatus,
            payment.paymentMethod,
            payment.paymentGateway,
            payment.paymentFor,
            payment.initialAmount,
            payment.discountAmount,
            payment.totalAmount,
            payment.createdAt,
            payment.updatedAt,
            payment.userId,
            payment.providerId,
        )
    }

    async createPaymentForSubscription(payment: CreatePaymentForSubscriptionProps, options: { session?: any } = {}): Promise<Payment | null> {
        try {
            const newPayment = await PaymentModel.create([payment],options);
            return newPayment ? this.mapToEntity(newPayment[0]) : null;
        } catch (error) {
            console.error("error : ",error);
            throw new Error("Payment creation error.");
        }
    }
}