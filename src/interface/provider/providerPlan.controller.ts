import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { ProviderFetchAllPlansUseCase } from "../../application/provider-use.case/providerPlan.use-case";

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