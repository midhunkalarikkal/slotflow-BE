import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { ProviderFetchAllPlansUseCaseResponse } from "../../infrastructure/dtos/provider.dto";


export class ProviderFetchAllPlansUseCase {
    constructor(private planRepositoryImpl: PlanRepositoryImpl) { }

    async execute(): Promise<ProviderFetchAllPlansUseCaseResponse> {
        const plans = await this.planRepositoryImpl.findAllPlansForDisplay();
        if(!plans) throw new Error("Plans Fetching error");
        return { success: true, message: "Plans fetched.", plans};
    }
}