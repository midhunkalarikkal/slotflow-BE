import { Types } from "mongoose";
import { BillingCycle, Plan } from "../../../domain/entities/plan.entity";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";

export class AdminPlanListUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(): Promise<{ success: boolean, message: string, plans: Plan[] }> {
        const plans = await this.planRepository.getAllPlans();
        if (!plans) throw new Error("Plans fetching error");
        return { success: true, message: "Plans fetched", plans };
    }
}

export class AdminCreatePlanUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(planName: string, description: string, price: number, features: [string], billingCycle: BillingCycle, maxBookingPerMonth: number, adVisibility: boolean): Promise<{ success: boolean, message: string, plan?: Plan}> {
        if (!planName || !description || price < 0 || !features || !billingCycle || maxBookingPerMonth < 0) throw new Error("Invalid plan data.");
        const newPlan = await this.planRepository.createPlan({ planName, description, price, features, billingCycle, maxBookingPerMonth, adVisibility, isBlocked: false,});
        if(!newPlan) throw new Error("Plan adding failed, please try again.");
        return { success: true, message: "Plan created successfully.", plan: newPlan};
    }

}

export class AdminChangePlanStatusUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(planId: string, status: boolean): Promise<{ success: boolean, message: string, updatedPlan : Partial<Plan>}> {
        if(!planId || status === null) throw new Error("Invalid request");
        const updatedPlan = await this.planRepository.changePlanStatus(new Types.ObjectId(planId), status);
        if(!updatedPlan) throw new Error("Plan status changing failed.");
        return { success: true, message: `Plan ${status ? "Blocked" : "Unblocked"} successfully.`, updatedPlan}
    }
}