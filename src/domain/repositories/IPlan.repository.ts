import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";

export type FindAllPlansProps = Pick<Plan, "_id" | "planName" | "isBlocked">;

export interface IPlanRepository {
    createPlan(plan: Plan): Promise<Plan | null>;

    updatePlan(planId: Types.ObjectId, updateData: Partial<Plan>): Promise<Partial<Plan> | null>;
    
    changePlanStatus(planId: Types.ObjectId, status: boolean): Promise<Partial<Plan> | null>;

    findPlanById(planId: Types.ObjectId): Promise<Plan | null>;

    findAllPlans(): Promise<FindAllPlansProps[] | null>;
}