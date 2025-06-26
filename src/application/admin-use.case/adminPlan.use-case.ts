import { Validator } from "../../infrastructure/validator/validator";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { 
    AdminPlanListUseCaseResponse, 
    AdminCreatePlanUseCaseResponse, 
    AdminAddNewPlanUseCaseRequestPayload, 
    AdminChangePlanStatusUseCaseResponse, 
    AdminChangePlanIsBlockedStatusUseCaseRequestPayload, 
} from "../../infrastructure/dtos/admin.dto";


export class AdminPlanListUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute(): Promise<AdminPlanListUseCaseResponse> {
        const plans = await this.planRepositoryImpl.findAllPlans();
        if (!plans) throw new Error("Plans fetching error");
        return { success: true, message: "Plans fetched", plans };
    }
}


export class AdminCreatePlanUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute(data : AdminAddNewPlanUseCaseRequestPayload): Promise<AdminCreatePlanUseCaseResponse> {
        const {planName, description, price, features, maxBookingPerMonth, adVisibility} = data;
        if (!planName || !description || price < 0 || !features || maxBookingPerMonth < 0) throw new Error("Invalid plan data.");

        Validator.validatePlanName(planName);
        Validator.validatePlanDescription(description);
        Validator.validatePlanPrice(price);
        Validator.validatePlanFeatures(features);
        Validator.validatePlanMaxBookingPerMonth(maxBookingPerMonth);
        Validator.validateBooleanValue(adVisibility, "adVisibility");

        const existingPlan = await this.planRepositoryImpl.findPlanByNameOrPrice({planName, price});
        const responseText: string = existingPlan?.planName === planName ? "name" : "price"
        if(existingPlan) throw new Error(`Plan with same ${responseText} already exists.`);
        const newPlan = await this.planRepositoryImpl.createPlan({ planName, description, price, features, maxBookingPerMonth, adVisibility, isBlocked: false,});
        if(!newPlan) throw new Error("Plan adding failed, please try again.");
        const planData = {
            _id: newPlan._id,
            planName: newPlan.planName,
            isBlocked: newPlan.isBlocked,
        }
        return { success: true, message: "Plan created successfully.", plan: planData };
    }

}


export class AdminChangePlanBlockStatusUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute(data: AdminChangePlanIsBlockedStatusUseCaseRequestPayload): Promise<AdminChangePlanStatusUseCaseResponse> {
        const {planId, isBlocked} = data;
        if(!planId || isBlocked === null) throw new Error("Invalid request");

        Validator.validateObjectId(planId, "PlanId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");
        
        const existingPlan = await this.planRepositoryImpl.findPlanById(planId);
        if(!existingPlan) throw new Error("Plan does not exists.");
        existingPlan.isBlocked = isBlocked;
        const updatedPlan = await this.planRepositoryImpl.updatePlan(planId, existingPlan);
        if(!updatedPlan) throw new Error("Plan status changing failed.");
        const updatedPlanDatadata = {
            _id: updatedPlan._id,
            planName: updatedPlan.planName,
            isBlocked: updatedPlan.isBlocked,
        }
        return { success: true, message: `Plan ${isBlocked ? "Blocked" : "Unblocked"} successfully.`, updatedPlan: updatedPlanDatadata }
    }
}