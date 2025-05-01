import { Types } from "mongoose";
import { IPayment, PaymentModel } from "./payment.model";
import { Payment } from "../../../domain/entities/payment.entity";
import { CreatePaymentForBookingProps, CreatePaymentForSubscriptionProps, FindAllPayments, FindAllPaymentsByProviderIdResProps, FindAllPaymentsByUserIdResProps, IPaymentRepository } from "../../../domain/repositories/IPayment.repository";

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
            throw new Error("Payment creation error.");
        }
    }
    
    async createPaymentForBooking(payment: CreatePaymentForBookingProps, options: { session?: any } = {}): Promise<Payment | null> {
        try {
            const newPayment = await PaymentModel.create([payment],options);
            return newPayment ? this.mapToEntity(newPayment[0]) : null;
        } catch (error) {
            throw new Error("Payment creation error.");
        }
    }
    
    async findAllPaymentsByProviderId(providerId: Types.ObjectId): Promise<Array<FindAllPaymentsByProviderIdResProps> | []> {
        try{
            const payments = await PaymentModel.find({providerId: providerId}).sort({createdAt : 1})
            .select("_id paymentStatus paymentMethod paymentGateway paymentFor discountAmount totalAmount createdAt");
            return payments;
        }catch (error) {
            throw new Error("Finding payments error.");
        }
    }

    async findAllPaymentsByUserId(userId: Types.ObjectId): Promise<Array<FindAllPaymentsByUserIdResProps> | []> {
        try{
            const payments = await PaymentModel.find({userId: userId}).sort({createdAt : 1})
            .select("_id paymentStatus paymentMethod paymentGateway paymentFor discountAmount totalAmount createdAt");
            return payments;
        }catch (error) {
            throw new Error("Finding payments error.");
        }
    }

    async findAllPayments(): Promise<Array<FindAllPayments> | []> {
        try{
            const payments = await PaymentModel.find({}).sort({ createdAt: 1 })
            .select("-_id createdAt totalAmount paymentFor paymentGateway paymentStatus paymentMethod");
            return payments;
        }catch (error) {
            throw new Error("Payments fetching error.");
        }
    }
}