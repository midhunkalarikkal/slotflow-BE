import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";

export interface IPlanRepository {
    createPlan(plan: Plan): Promise<Plan | null>;
    updatePlan(planId: Types.ObjectId, updateData: Partial<Plan>): Promise<Partial<Plan> | null>;
    changePlanStatus(planId: Types.ObjectId, status: boolean): Promise<Partial<Plan> | null>;
    findPlanById(planId: Types.ObjectId): Promise<Plan | null>;
    getAllPlans(): Promise<Plan[]>;
}