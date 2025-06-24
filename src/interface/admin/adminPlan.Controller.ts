import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { AdminChangePlanBlockStatusUseCase, AdminCreatePlanUseCase, AdminPlanListUseCase } from "../../application/admin-use.case/adminPlan.use-case";
import { AdminAddNewPlanZodSchema, AdminChangePlanIsBlockStatusZodSchema } from "../../infrastructure/zod/admin.zod";

const planRepositoryImpl = new PlanRepositoryImpl();

const adminPlanListUseCase = new AdminPlanListUseCase(planRepositoryImpl);
const adminCreatePlanUseCase = new AdminCreatePlanUseCase(planRepositoryImpl);
const adminChangePlanBlockStatusUseCase = new AdminChangePlanBlockStatusUseCase(planRepositoryImpl);

class AdminPlanController {
    constructor(
        private adminPlanListUseCase : AdminPlanListUseCase,
        private adminCreatePlanUseCase : AdminCreatePlanUseCase,
        private adminChangePlanBlockStatusUseCase : AdminChangePlanBlockStatusUseCase,
    ){
        this.getAllPLans = this.getAllPLans.bind(this);
        this.addNewPlan = this.addNewPlan.bind(this);
        this.changePlanBlockStatus = this.changePlanBlockStatus.bind(this);
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
            const validateData = AdminAddNewPlanZodSchema.parse(req.body);
            const { planName, description, price, features, maxBookingPerMonth, adVisibility } = validateData;
            if(!planName || !description || price === undefined || features.length === 0 || !maxBookingPerMonth || typeof adVisibility !== "boolean") throw new Error("Invalid request.");
            const result = await this.adminCreatePlanUseCase.execute({planName, description, price, features, maxBookingPerMonth, adVisibility });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async changePlanBlockStatus(req: Request, res: Response) {
        try{
            const validateData = AdminChangePlanIsBlockStatusZodSchema.parse(req.body);
            const { planId, isBlocked } = validateData;
            if(!planId || !isBlocked) throw new Error("Invalid request.");
            const result = await this.adminChangePlanBlockStatusUseCase.execute({planId : new Types.ObjectId(planId as string), isBlocked });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminPlanController = new AdminPlanController(adminPlanListUseCase,adminCreatePlanUseCase, adminChangePlanBlockStatusUseCase);
export { adminPlanController };