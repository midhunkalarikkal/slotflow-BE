import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { AdminChangePlanStatusUseCase, AdminCreatePlanUseCase, AdminPlanListUseCase } from "../../application/use-cases/admin/adminPlan.use-case";

const planRepositoryImpl = new PlanRepositoryImpl();
const adminPlanListUseCase = new AdminPlanListUseCase(planRepositoryImpl);
const adminCreatePlanUseCase = new AdminCreatePlanUseCase(planRepositoryImpl);
const adminChangePlanStatusUseCase = new AdminChangePlanStatusUseCase(planRepositoryImpl);

class AdminPlanController {
    constructor(
        private adminPlanListUseCase : AdminPlanListUseCase,
        private adminCreatePlanUseCase : AdminCreatePlanUseCase,
        private adminChangePlanStatusUseCase : AdminChangePlanStatusUseCase,
    ){
        this.getAllPLans = this.getAllPLans.bind(this);
        this.addNewPlan = this.addNewPlan.bind(this);
        this.changePlanStatus = this.changePlanStatus.bind(this);
    }

    async getAllPLans(req: Request, res: Response) {
        try{
            const result = await this.adminPlanListUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async addNewPlan(req: Request, res: Response) {
        try{
            const { planName, description, price, features, billingCycle, maxBookingPerMonth, adVisibility } = req.body;
            if(!planName || !description || !price || !features || !billingCycle || !maxBookingPerMonth || !adVisibility) throw new Error("Invalid request.");
            const result = await this.adminCreatePlanUseCase.execute( planName, description, price, features, billingCycle, maxBookingPerMonth, adVisibility );
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async changePlanStatus(req: Request, res: Response) {
        try{
            const { planId } = req.params;
            const { status } = req.query;
            if(!planId || !status) throw new Error("Invalid request.");
            const statusValue = status === "true";
            const result = await this.adminChangePlanStatusUseCase.execute(planId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminPlanController = new AdminPlanController(adminPlanListUseCase,adminCreatePlanUseCase, adminChangePlanStatusUseCase);
export { adminPlanController };