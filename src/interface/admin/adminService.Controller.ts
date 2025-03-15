import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminServiceUseCase } from "../../application/use-cases/admin/adminService.use-case";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";

const serviceRepositoryImpl = new ServiceRepositoryImpl();
const adminServiceUseCase = new AdminServiceUseCase(serviceRepositoryImpl)

class AdminServiceController {
    constructor(
        private adminServiceUseCase: AdminServiceUseCase,
    ){
        this.getAllServices = this.getAllServices.bind(this);
        this.addService = this.addService.bind(this);
        this.changeServiceStatus = this.changeServiceStatus.bind(this);
    }

    async getAllServices(req: Request, res: Response) {
        try{
            const result = await this.adminServiceUseCase.serviceList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async addService(req: Request, res: Response) {
        try{
            const  { serviceName } = req.body;
            const result = await this.adminServiceUseCase.addService(serviceName);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async changeServiceStatus(req: Request, res: Response) {
        try{
            const { serviceId } = req.params;
            const { status } = req.query;
            const statusValue = status === 'true';
            const result = await this.adminServiceUseCase.changeStatus(serviceId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
   
}

const adminServiceController = new AdminServiceController(adminServiceUseCase);
export { adminServiceController };

