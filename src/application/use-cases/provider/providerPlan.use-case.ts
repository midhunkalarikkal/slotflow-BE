import { ProviderFetchAllPlansResProps } from "../../../shared/interface/providerInterface";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";


export class ProviderFetchAllPlansUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(): Promise<ProviderFetchAllPlansResProps> {
        const plans = await this.planRepository.findAllPlansForDisplay();
        if(!plans) throw new Error("Plans Fetching error");
        return { success: true, message: "Plans fetched.", plans};
    }
}