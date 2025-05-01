import { Types } from "mongoose";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";
import { AdminChangePlanStatusResProps, AdminCreatePlanResProps, AdminPlanListResProps } from "../../../shared/interface/adminInterface";


export class AdminPlanListUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(): Promise<AdminPlanListResProps> {
        const plans = await this.planRepository.findAllPlans();
        if (!plans) throw new Error("Plans fetching error");
        return { success: true, message: "Plans fetched", plans };
    }
}

export class AdminCreatePlanUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(planName: string, description: string, price: number, features: string[], maxBookingPerMonth: number, adVisibility: boolean): Promise<AdminCreatePlanResProps> {
        if (!planName || !description || price < 0 || !features || maxBookingPerMonth < 0) throw new Error("Invalid plan data.");
        const existingPlan = await this.planRepository.findPlanByNameOrPrice({planName, price});
        const responseText: string = existingPlan?.planName === planName ? "name" : "price"
        if(existingPlan) throw new Error(`Plan with same ${responseText} already exists.`);
        const newPlan = await this.planRepository.createPlan({ planName, description, price, features, maxBookingPerMonth, adVisibility, isBlocked: false,});
        if(!newPlan) throw new Error("Plan adding failed, please try again.");
        const data = {
            _id: newPlan._id,
            planName: newPlan.planName,
            isBlocked: newPlan.isBlocked,
        }
        return { success: true, message: "Plan created successfully.", plan: data };
    }

}

export class AdminChangePlanStatusUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(planId: string, status: boolean): Promise<AdminChangePlanStatusResProps> {
        if(!planId || status === null) throw new Error("Invalid request");
        const existingPlan = await this.planRepository.findPlanById(new Types.ObjectId(planId));
        if(!existingPlan) throw new Error("Plan does not exists.");
        existingPlan.isBlocked = status;
        const updatedPlan = await this.planRepository.updatePlan(new Types.ObjectId(planId), existingPlan);
        if(!updatedPlan) throw new Error("Plan status changing failed.");
        const data = {
            _id: updatedPlan._id,
            planName: updatedPlan.planName,
            isBlocked: updatedPlan.isBlocked,
        }
        return { success: true, message: `Plan ${status ? "Blocked" : "Unblocked"} successfully.`, updatedPlan: data}
    }
}