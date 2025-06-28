import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { AdminAddServiceUseCase, AdminChnageServiceBlockStatusUseCase, AdminServiceListUseCase } from "../../application/admin-use.case/adminService.use-case";
import { AdminAddServiceXZodSchema, AdminChangeServiceBlockStatusZodSchema } from "../../infrastructure/zod/admin.zod";
import { RequestQueryCommonZodSchema } from "../../infrastructure/zod/common.zod";

const serviceRepositoryImpl = new ServiceRepositoryImpl();

const adminServiceListUseCase = new AdminServiceListUseCase(serviceRepositoryImpl)
const adminAddServiceUseCase = new AdminAddServiceUseCase(serviceRepositoryImpl)
const adminChnageServiceBlockStatusUseCase = new AdminChnageServiceBlockStatusUseCase(serviceRepositoryImpl)

class AdminServiceController {
    constructor(
        private adminServiceListUseCase: AdminServiceListUseCase,
        private adminAddServiceUseCase: AdminAddServiceUseCase,
        private adminChnageServiceBlockStatusUseCase: AdminChnageServiceBlockStatusUseCase,
    ){
        this.getAllServices = this.getAllServices.bind(this);
        this.addService = this.addService.bind(this);
        this.changeServiceBlockStatus = this.changeServiceBlockStatus.bind(this);
    }

    async getAllServices(req: Request, res: Response) {
        try{
            const validateQueryData = RequestQueryCommonZodSchema.parse(req.query);
            const { page, limit } = validateQueryData;
            const result = await this.adminServiceListUseCase.execute({ page, limit });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async addService(req: Request, res: Response) {
        try{
            const validateData = AdminAddServiceXZodSchema.parse(req.body);
            const { appServiceName } = validateData;
            if(!appServiceName) throw new Error("Invalid request.");
            const result = await this.adminAddServiceUseCase.execute({serviceName : appServiceName});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async changeServiceBlockStatus(req: Request, res: Response) {
        try{
            const validateData = AdminChangeServiceBlockStatusZodSchema.parse(req.body);
            const { serviceId, isBlocked } = validateData;
            const result = await this.adminChnageServiceBlockStatusUseCase.execute({serviceId: new Types.ObjectId(serviceId), isBlocked });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
   
}

const adminServiceController = new AdminServiceController(adminServiceListUseCase, adminAddServiceUseCase, adminChnageServiceBlockStatusUseCase);
export { adminServiceController };

