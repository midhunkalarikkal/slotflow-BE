import { BillingCycle, Plan } from "../../../domain/entities/plan.entity";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";

export class AdminPlanUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async planList(): Promise<{ success: boolean, message: string, plans: Plan[] }> {
        const plans = await this.planRepository.getAllPlans();
        if (!plans) throw new Error("Plans fetching error");
        return { success: true, message: "Plans fetched", plans };
    }

    async createPlan(planName: string, description: string, price: number, features: [string], billingCycle: BillingCycle, maxBookingPerMonth: number, adVisibility: boolean): Promise<{ success: boolean, message: string, plan?: Plan}> {
        if (!planName || !description || price < 0 || !features || !billingCycle || maxBookingPerMonth < 0) {
            return { success: false, message: "Invalid plan data." };
        }
        const newPlan: Plan = await this.planRepository.createPlan({ planName, description, price, features, billingCycle, maxBookingPerMonth, adVisibility, isBlocked: false,});
        return { success: true, message: "Plan created successfully.", plan: newPlan};
    }
}