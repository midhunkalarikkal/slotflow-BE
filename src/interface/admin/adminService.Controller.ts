import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { AdminAddServiceUseCase, AdminChnageServiceStatusUseCase, AdminServiceListUseCase } from "../../application/admin-use.case/adminService.use-case";
import { AdminAddServiceXZodSchema, AdminChangeServiceStatusParamsZodSchema, AdminChangeServiceStatusQueryZodSchema } from "../../infrastructure/zod/admin.zod";

const serviceRepositoryImpl = new ServiceRepositoryImpl();

const adminServiceListUseCase = new AdminServiceListUseCase(serviceRepositoryImpl)
const adminAddServiceUseCase = new AdminAddServiceUseCase(serviceRepositoryImpl)
const adminChnageServiceStatusUseCase = new AdminChnageServiceStatusUseCase(serviceRepositoryImpl)

class AdminServiceController {
    constructor(
        private adminServiceListUseCase: AdminServiceListUseCase,
        private adminAddServiceUseCase: AdminAddServiceUseCase,
        private adminChnageServiceStatusUseCase: AdminChnageServiceStatusUseCase,
    ){
        this.getAllServices = this.getAllServices.bind(this);
        this.addService = this.addService.bind(this);
        this.changeServiceStatus = this.changeServiceStatus.bind(this);
    }

    async getAllServices(req: Request, res: Response) {
        try{
            const result = await this.adminServiceListUseCase.execute();
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

    async changeServiceStatus(req: Request, res: Response) {
        try{
            const validateParams = AdminChangeServiceStatusParamsZodSchema.parse(req.params);
            const validateQuery = AdminChangeServiceStatusQueryZodSchema.parse(req.query);
            const { serviceId } = validateParams;
            const { isBlocked } = validateQuery;
            if(!serviceId || !isBlocked) throw new Error("Invalid request.");
            const blockedStatus = isBlocked === 'true';
            const result = await this.adminChnageServiceStatusUseCase.execute({serviceId: new Types.ObjectId(serviceId), isBlocked : blockedStatus});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
   
}

const adminServiceController = new AdminServiceController(adminServiceListUseCase, adminAddServiceUseCase, adminChnageServiceStatusUseCase);
export { adminServiceController };

