import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { AdminAddNewPlanZodSchema, AdminChangePlanIsBlockStatusZodSchema } from "../../infrastructure/zod/admin.zod";
import { AdminChangePlanBlockStatusUseCase, AdminCreatePlanUseCase, AdminPlanListUseCase } from "../../application/admin-use.case/adminPlan.use-case";

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
            const result = await this.adminChangePlanBlockStatusUseCase.execute({planId : new Types.ObjectId(planId as string), isBlocked });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    // TODO UPDATE PLAN
}

const adminPlanController = new AdminPlanController(adminPlanListUseCase,adminCreatePlanUseCase, adminChangePlanBlockStatusUseCase);
export { adminPlanController };