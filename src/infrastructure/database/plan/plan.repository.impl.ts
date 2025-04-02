import { Types } from "mongoose";
import { IPlan, PlanModel } from "./plan.model";
import { Plan } from "../../../domain/entities/plan.entity";
import { CreatePlanProps, findAllPlansForDisplayResProps, FindAllPlansProps, findPlanByNameOrPriceProps, IPlanRepository } from "../../../domain/repositories/IPlan.repository";

export class PlanRepositoryImpl implements IPlanRepository {
    private mapToEntity(plan: IPlan): Plan {
        return new Plan (
            plan._id,
            plan.planName,
            plan.description,
            plan.price,
            plan.features,
            plan.maxBookingPerMonth,
            plan.adVisibility,
            plan.isBlocked,
            plan.createdAt,
            plan.updatedAt,
        )
    }

    async createPlan(plan: CreatePlanProps): Promise<Plan | null> {
        try{
            const newPlan = await PlanModel.create(plan);
            return newPlan ? this.mapToEntity(newPlan) : null;
        }catch(error){
            throw new Error("Failed to create plan.")
        }
    }

    async updatePlan(planId: Types.ObjectId, plan: Plan): Promise<Plan | null> {
        try{
            const updatedPlan = await PlanModel.findByIdAndUpdate(planId, plan, { new: true });
            return updatedPlan ? this.mapToEntity(updatedPlan) : null;
        }catch{
            throw new Error("Fialed to updated plan.");
        }
    }

    async findPlanById(planId: Types.ObjectId): Promise<Plan | null> {
        try{
            const plan = await PlanModel.findById(planId);
            return plan || null;
        }catch{
            throw new Error("Plan not found.");
        }
    }

    async findAllPlans(): Promise<Array<FindAllPlansProps> | null> {
        try{
            const plans = await PlanModel.find({},{_id:1, planName: 1, isBlocked: 1});
            return plans ?  plans.map(plan => this.mapToEntity(plan)) : null;
        }catch{
            throw new Error("Failed to fetch all plans.");
        }
    }

    async findPlanByNameOrPrice(plan: findPlanByNameOrPriceProps): Promise<Plan | null> {
        try{
            const existingPlan = await PlanModel.findOne({
                $or: [
                    {planName: plan.planName},
                    {price: plan.price}
                ]
            });
            return existingPlan ? this.mapToEntity(existingPlan) : null;
        }catch(error){
            console.log("error : ",error);
            throw new Error("Plan searching error.");
        }
    }

    async findAllPlansForDisplay(): Promise<Array<findAllPlansForDisplayResProps> | null> {
        try{
            const plans = await PlanModel.find({},{_id:1, planName: 1, price: 1, features: 1, description: 1});
            return plans ? plans.map((plan) => this.mapToEntity(plan)) : null;
        }catch(error){
            throw new Error("Plans fetching error.");
        }
    }
}