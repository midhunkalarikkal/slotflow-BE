import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { AdminAddServiceUseCase, AdminChnageServiceStatusUseCase, AdminServiceListUseCase } from "../../application/use-cases/admin/adminService.use-case";

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
            const  { serviceName } = req.body;
            if(!serviceName) throw new Error("Invalid request.");
            const result = await this.adminAddServiceUseCase.execute(serviceName);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async changeServiceStatus(req: Request, res: Response) {
        try{
            const { serviceId } = req.params;
            const { status } = req.query;
            if(!serviceId || !status) throw new Error("Invalid request.");
            const statusValue = status === 'true';
            const result = await this.adminChnageServiceStatusUseCase.execute(serviceId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
   
}

const adminServiceController = new AdminServiceController(adminServiceListUseCase, adminAddServiceUseCase, adminChnageServiceStatusUseCase);
export { adminServiceController };

