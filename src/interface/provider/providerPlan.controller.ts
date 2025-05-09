import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderFetchAllPlansUseCase } from "../../application/use-cases/provider/providerPlan.use-case";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";

const planRepositoryImpl = new PlanRepositoryImpl();
const providerFetchAllPlansUseCase = new ProviderFetchAllPlansUseCase(planRepositoryImpl);

export class ProviderPlanController {
    constructor(
        private providerFetchAllPlansUseCase: ProviderFetchAllPlansUseCase,
    ) {
        this.fetchAllPlans = this.fetchAllPlans.bind(this);
    }

    async fetchAllPlans(req: Request, res: Response) {
        try{
            const result = await this.providerFetchAllPlansUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
}

const providerPlanController = new ProviderPlanController( providerFetchAllPlansUseCase );
export { providerPlanController };