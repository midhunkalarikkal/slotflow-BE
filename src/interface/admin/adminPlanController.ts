import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminPlanUseCase } from "../../application/use-cases/admin/adminPlan.use-case";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";

const planRepositoryImpl = new PlanRepositoryImpl();
const adminPlanUseCase = new AdminPlanUseCase(planRepositoryImpl);

class AdminPlanController {
    constructor(private adminPlanUseCase : AdminPlanUseCase){
        this.getAllPLans = this.getAllPLans.bind(this);
        this.addNewPlan = this.addNewPlan.bind(this);
    }

    async getAllPLans(req: Request, res: Response) {
        try{
            const result = await this.adminPlanUseCase.planList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async addNewPlan(req: Request, res: Response) {
        try{
            const { planName, description, price, features, billingCycle, maxBookingPerMonth, adVisibility } = req.body;
            const result = await this.adminPlanUseCase.createPlan( planName, description, price, features, billingCycle, maxBookingPerMonth, adVisibility );
            return res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
}

const adminPlanController = new AdminPlanController(adminPlanUseCase);
export { adminPlanController };