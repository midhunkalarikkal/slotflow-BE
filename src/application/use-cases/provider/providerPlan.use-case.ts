import { findAllPlansForDisplayResProps } from "../../../domain/repositories/IPlan.repository";
import { PlanRepositoryImpl } from "../../../infrastructure/database/plan/plan.repository.impl";

export class ProviderFetchAllPlansUseCase {
    constructor(private planRepository: PlanRepositoryImpl) { }

    async execute(): Promise<{ success: boolean , message: string, plans: findAllPlansForDisplayResProps[]}> {
        const plans = await this.planRepository.findAllPlansForDisplay();
        if(!plans) throw new Error("Plans Fetching error");
        return { success: true, message: "Plans fetched.", plans};
    }
}