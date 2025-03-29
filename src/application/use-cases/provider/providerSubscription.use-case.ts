import Stripe from "stripe";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";
import { Types } from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class ProviderSubscribeToPlanUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(providerId: string, planId: string, duration: string): Promise<{ success: boolean, message: string, sessionId: string }> {
        if (!providerId || !planId || !duration) throw new Error("Invalid request.");
        let planDuration: number = parseInt(duration.trim().split(" ")[0]);

        const plan = await this.planRepository.findPlanById(new Types.ObjectId(planId));
        if (!plan) throw new Error("Unexpected error, please try again after sometimes.");

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
            success_url: `http://localhost:5137/PaymentSuccess/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5137/PaymentFailed/`,
            metadata: {
                providerId: providerId,
                planId: planId,
                planDuration: planDuration,
            }
        });
        return { success: true, message: "Session id generated.", sessionId: session.id };
    }
}