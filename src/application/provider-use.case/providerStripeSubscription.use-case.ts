import dayjs from "dayjs";
import Stripe from "stripe";
import { startSession, Types } from "mongoose";
import { 
    ProviderSaveSubscriptionRequest, 
    ProviderStripeSubscriptionCreateSessionIdRequest, 
    ProviderStripeSubscriptionCreateSessionIdResponse, 
} from "../../infrastructure/dtos/provider.dto";
import { ApiResponse } from "../../infrastructure/dtos/common.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class ProviderStripeSubscriptionCreateSessionIdUseCase {
    constructor(
            private planRepositoryImpl: PlanRepositoryImpl,
            private providerRepositoryImpl: ProviderRepositoryImpl,
            private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
        ) { }
    
        async execute({ providerId, planId, duration }: ProviderStripeSubscriptionCreateSessionIdRequest): Promise<ApiResponse<ProviderStripeSubscriptionCreateSessionIdResponse>> {

            if (!providerId || !planId || !duration) throw new Error("Invalid request.");

            Validator.validateObjectId(providerId, "providerId");
            Validator.validateObjectId(planId, "planId");
            Validator.validatePlanDuration(duration);

            let planDuration: number = parseInt(duration.trim().split(" ")[0]);
    
            const provider = await this.providerRepositoryImpl.findProviderById(providerId);
            if (!provider) throw new Error("No user found, please logout and try again.");
    
            const plan = await this.planRepositoryImpl.findPlanById(planId);
            if (!plan) throw new Error("Unexpected error, please try again after sometimes.");
    
            const providerLastSubscriptionsId = provider.subscription.pop();

            if(providerLastSubscriptionsId) {   
                const subscription = await this.subscriptionRepositoryImpl.findSubscriptionById(providerLastSubscriptionsId!);
                if(subscription){
                    if(subscription.subscriptionStatus === "Active") throw new Error("Your subscription is on live.");
                    const isSubscriptionExpired = dayjs().isAfter(dayjs(subscription.endDate), "day");
                    if(!isSubscriptionExpired) throw new Error("Your subscription is on live.");
                }
            }
    
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [{
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: plan.planName,
                            description: plan.description,
                        },
                        unit_amount: plan.price * planDuration * 100,
                    },
                    quantity: 1
                }],
                success_url: `http://localhost:5173/provider/payment-success/?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:5173/provider/payment-failed/`,
                metadata: {
                    providerId: providerId.toString(),
                    planId: planId.toString(),
                    planDuration: planDuration,
                    initialAmount: plan.price * planDuration * 100,
                    totalAmount: plan.price * planDuration * 100,
                }
            });
            return { success: true, message: "Session id generated.", data: session.id };
        }
}

export class ProviderSaveSubscriptionUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute({ providerId, sessionId }: ProviderSaveSubscriptionRequest): Promise<ApiResponse> {

        if (!providerId || !sessionId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateStripeSessionId(sessionId);

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const pId = session?.metadata?.providerId;
        const totalAmount = Number(session?.metadata?.totalAmount);
        const initialAmount = Number(session?.metadata?.initialAmount);
        const paymentStatus = session?.payment_status === "paid" ? "Paid" : "Pending";
        const paymentType = session?.payment_method_types[0];
        const subscriptionPlanId = session?.metadata?.planId;
        const planDuration = Number(session?.metadata?.planDuration);
        const paymentIntent = session?.payment_intent;

        if (!pId || isNaN(totalAmount) || isNaN(initialAmount) || !paymentStatus || !paymentType || !subscriptionPlanId || !planDuration || !paymentIntent) throw new Error("Unexpected error, please try again.");

        const mongoSession = await startSession();
        mongoSession.startTransaction();

        try {
            const payment = await this.paymentRepositoryImpl.createPaymentForSubscription({
                transactionId: paymentIntent.toString(),
                paymentStatus: paymentStatus,
                paymentMethod: paymentType,
                paymentGateway: "Stripe",
                paymentFor: "Provider Subscription",
                initialAmount: Number(initialAmount) / 100,
                discountAmount: 0,
                totalAmount: Number(totalAmount) / 100,
                providerId: new Types.ObjectId(pId),
            }, { session: mongoSession });

            if (!payment) throw new Error("Unexpected error, payment saving error.");

            const subscription = await this.subscriptionRepositoryImpl.createSubscription({
                providerId: new Types.ObjectId(pId),
                subscriptionPlanId: new Types.ObjectId(subscriptionPlanId),
                startDate: new Date(),
                endDate: dayjs().add(Number(planDuration * 30), "day").toDate(),
                subscriptionStatus: "Active",
                paymentId: payment._id,
            }, { session: mongoSession });

            if (!subscription) throw new Error("Subscription saving error.");

            provider.subscription.push(subscription._id);

            const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
            if (!updatedProvider) throw new Error("Unexpected error, subscription adding error.");

            await mongoSession.commitTransaction();
            mongoSession.endSession();

            return { success: true, message: "Your Subscription has been activated." };
        } catch(error) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            throw new Error("Subscribing error.");
        }
    }
}