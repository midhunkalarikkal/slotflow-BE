import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminUserUseCase } from "../../application/use-cases/admin/adminUser.use-case";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AdminServiceUseCase } from "../../application/use-cases/admin/admin_service.use-case";
import { AdminProviderUseCase } from "../../application/use-cases/admin/adminProvider.use-case";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const serviceRepositoryImpl = new ServiceRepositoryImpl();
const adminUserUseCase = new AdminUserUseCase(userRepositoryImpl);
const adminProviderUseCase = new AdminProviderUseCase(providerRepositoryImpl);
const adminServiceUseCase = new AdminServiceUseCase(serviceRepositoryImpl)

export class AdminController {
    constructor(
        private adminProviderUseCase : AdminProviderUseCase,
        private adminUserUseCase : AdminUserUseCase,
        private adminServiceUseCase: AdminServiceUseCase,
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.approveProvider = this.approveProvider.bind(this);
        this.changeProviderStatus = this.changeProviderStatus.bind(this);
        this.changeUserStatus = this.changeUserStatus.bind(this);
        this.getAllServices = this.getAllServices.bind(this);
    }

    async getAllProviders(req: Request, res: Response) {
        try{
            const result = await this.adminProviderUseCase.providersList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try{
            const result = await this.adminUserUseCase.usersList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async approveProvider(req: Request, res: Response) {
        try{
            const { providerId } = req.params;
            const result = await this.adminProviderUseCase.approveProvider(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeProviderStatus(req: Request, res: Response) {
        try{
            const { providerId } = req.params;
            const { status } = req.query;
            const statusValue = status === 'true';
            const result = await this.adminProviderUseCase.changeStatus(providerId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeUserStatus(req: Request, res: Response) {
        try{
            console.log("Call")
            const { userId } = req.params;
            const { status } = req.query;
            const statusValue = status === 'true';
            const result = await this.adminUserUseCase.changeStatus(userId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async getAllServices(req: Request, res: Response) {
        try{
            const result = await this.adminServiceUseCase.serviceList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

   
}

const adminController = new AdminController(adminProviderUseCase, adminUserUseCase, adminServiceUseCase);
export { adminController };

