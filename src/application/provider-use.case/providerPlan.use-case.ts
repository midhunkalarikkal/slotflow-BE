import { ApiResponse } from "../../infrastructure/dtos/common.dto";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { ProviderFetchAllPlansResponse } from "../../infrastructure/dtos/provider.dto";


export class ProviderFetchAllPlansUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute(): Promise<ApiResponse<ProviderFetchAllPlansResponse>> {
        
        const plans = await this.planRepositoryImpl.findAllPlansForDisplay();
        if(!plans) throw new Error("Plans Fetching error");
        return { success: true, message: "Plans fetched.", data: plans};
    }
}