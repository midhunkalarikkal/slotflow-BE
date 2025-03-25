import { Types } from "mongoose";
import { IPlan, PlanModel } from "./plan.model";
import { Plan } from "../../../domain/entities/plan.entity";
import { CreatePlanProps, FindAllPlansProps, IPlanRepository } from "../../../domain/repositories/IPlan.repository";

export class PlanRepositoryImpl implements IPlanRepository {
    private mapToEntity(plan: IPlan): Plan {
        return new Plan (
            plan._id,
            plan.planName,
            plan.description,
            plan.price,
            plan.features,
            plan.billingCycle,
            plan.maxBookingPerMonth,
            plan.adVisibility,
            plan.isBlocked,
            plan.createdAt,
            plan.updatedAt,
        )
    }

    async createPlan(plan: CreatePlanProps): Promise<Plan | null> {
        try{
            if(!plan) throw new Error("Invalid request.");
            const newPlan = await PlanModel.create(plan);
            return newPlan ? this.mapToEntity(newPlan) : null;
        }catch{
            throw new Error("Failed to create plan.")
        }
    }

    async updatePlan(planId: Types.ObjectId, updateData: Partial<Plan>): Promise<Partial<Plan> | null> {
        try{
            if(!planId) throw new Error("Plan not found.");
            const updatedPlan = await PlanModel.findByIdAndUpdate(planId,updateData,{ new: true });
            return updatedPlan || null;
        }catch{
            throw new Error("Fialed to updated plan.");
        }
    }

    async changePlanStatus(planId: Types.ObjectId, status: boolean): Promise<Partial<Plan> | null> {
        try{
            if(!planId) throw new Error("No plan found.");
            const updatedPlan = await PlanModel.findByIdAndUpdate(planId, { isBlocked: status },{ new: true, select: '_id isBlocked'});
            return updatedPlan || null;
        }catch{
            throw new Error("Failed to update plan status.");
        }
    }

    async findPlanById(planId: Types.ObjectId): Promise<Plan | null> {
        try{
            if(!planId) throw new Error("Plan not found.");
            const plan = await PlanModel.findById(planId);
            return plan || null;
        }catch{
            throw new Error("Plan not found.");
        }
    }

    async findAllPlans(): Promise<FindAllPlansProps[] | null> {
        try{
            const plans = await PlanModel.find({},{_id:1, planName: 1, isBlocked: 1});
            return plans ?  plans.map(plan => this.mapToEntity(plan)) : null;
        }catch{
            throw new Error("Failed to fetch all plans.");
        }
    }
}