import { Plan } from "../../../domain/entities/plan.entity";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";


interface ProviderFetchAllPlansResProps extends CommonResponse {
    plans: Array<Pick<Plan, "_id" | "planName" | "price" | "features" | "description">> | [];
}


export class ProviderFetchAllPlansUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(): Promise<ProviderFetchAllPlansResProps> {
        const plans = await this.planRepository.findAllPlansForDisplay();
        if(!plans) throw new Error("Plans Fetching error");
        return { success: true, message: "Plans fetched.", plans};
    }
}