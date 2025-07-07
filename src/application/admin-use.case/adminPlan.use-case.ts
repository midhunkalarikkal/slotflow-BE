import { 
    AdminPlanListResponse, 
    AdminAddNewPlanRequest, 
    AdminChangePlanIsBlockedStatusRequest,
} from "../../infrastructure/dtos/admin.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";


export class AdminPlanListUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminPlanListResponse>> {

        const result = await this.planRepositoryImpl.findAllPlans({ page, limit });
        if (!result) throw new Error("Plans fetching failed");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}


export class AdminCreatePlanUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute(payload : AdminAddNewPlanRequest): Promise<ApiResponse> {
        
        const {planName, description, price, features, maxBookingPerMonth, adVisibility} = payload;
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
        return { success: true, message: "Plan created successfully." };
    }

}


export class AdminChangePlanBlockStatusUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute({planId, isBlocked}: AdminChangePlanIsBlockedStatusRequest): Promise<ApiResponse> {

        if(!planId || isBlocked === null) throw new Error("Invalid request");

        Validator.validateObjectId(planId, "PlanId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");
        
        const existingPlan = await this.planRepositoryImpl.findPlanById(planId);
        if(!existingPlan) throw new Error("Plan does not exists.");
        existingPlan.isBlocked = isBlocked;
        const updatedPlan = await this.planRepositoryImpl.updatePlan(planId, existingPlan);
        if(!updatedPlan) throw new Error("Plan status changing failed.");
        return { success: true, message: `Plan ${isBlocked ? "Blocked" : "Unblocked"} successfully.` }
    }
}