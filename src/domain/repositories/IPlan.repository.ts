import { Types } from "mongoose";
import { Plan } from "../entities/plan.entity";

export type CreatePlanProps = Pick<Plan,'planName' | 'description' | 'price' | 'features' | "billingCycle" | "maxBookingPerMonth" | "adVisibility" | "isBlocked">;
export type FindAllPlansProps = Pick<Plan, "_id" | "planName" | "isBlocked">;
export type findPlanByNameOrPriceProps = Pick<Plan, "planName" | "price" >;
export type findAllPlansForDisplayResProps = Pick<Plan, "_id" | "planName" | "price" | "features" | "description">


export interface IPlanRepository {
    createPlan(plan: CreatePlanProps): Promise<Plan | null>;

    updatePlan(planId: Types.ObjectId, plna: Plan): Promise<Plan | null>;
    
    findPlanById(planId: Types.ObjectId): Promise<Plan | null>;

    findAllPlans(): Promise<FindAllPlansProps[] | null>;

    findPlanByNameOrPrice(plan: findPlanByNameOrPriceProps): Promise<Plan | null>;

    findAllPlansForDisplay(): Promise<findAllPlansForDisplayResProps[] | null>;

}