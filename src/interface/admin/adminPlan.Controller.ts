import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { PlanRepositoryImpl } from "../../infrastructure/database/plan/plan.repository.impl";
import { AdminChangePlanStatusUseCase, AdminCreatePlanUseCase, AdminPlanListUseCase } from "../../application/admin-use.case/adminPlan.use-case";
import { AdminAddNewPlanZodSchema, AdminChangePlanIsBlockedStatusReqParamsZodSchema, AdminChangePlanIsBlockedStatusReqQueryZodSchema } from "../../infrastructure/zod/admin.zod";

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
            const validateData = AdminAddNewPlanZodSchema.parse(req.body);
            const { planName, description, price, features, maxBookingPerMonth, adVisibility } = validateData;
            if(!planName || !description || price === undefined || features.length === 0 || !maxBookingPerMonth || typeof adVisibility !== "boolean") throw new Error("Invalid request.");
            const result = await this.adminCreatePlanUseCase.execute({planName, description, price, features, maxBookingPerMonth, adVisibility });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async changePlanStatus(req: Request, res: Response) {
        try{
            const validateParams = AdminChangePlanIsBlockedStatusReqParamsZodSchema.parse(req.params);
            const validateQuery = AdminChangePlanIsBlockedStatusReqQueryZodSchema.parse(req.query);
            const { planId } = validateParams;
            const { isBlocked } = validateQuery;
            if(!planId || !isBlocked) throw new Error("Invalid request.");
            const status = isBlocked === "true";
            const result = await this.adminChangePlanStatusUseCase.execute({planId : new Types.ObjectId(planId as string), isBlocked: status});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminPlanController = new AdminPlanController(adminPlanListUseCase,adminCreatePlanUseCase, adminChangePlanStatusUseCase);
export { adminPlanController };