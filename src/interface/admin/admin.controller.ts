import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AdminUserUseCase } from "../../application/use-cases/admin/adminUser.use-case";
import { AdminProviderUseCase } from "../../application/use-cases/admin/adminProvider.use-case";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const adminUserUseCase = new AdminUserUseCase(userRepositoryImpl);
const adminProviderUseCase = new AdminProviderUseCase(providerRepositoryImpl);

export class AdminController {
    constructor(
        private adminProviderUseCase : AdminProviderUseCase,
        private adminUserUseCase : AdminUserUseCase,
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.approveProvider = this.approveProvider.bind(this);
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
            console.log("call")
            const { providerId } = req.params;
            console.log("ProviderId : ",providerId);
            const result = await this.adminProviderUseCase.approveProvider(providerId);
            console.log("result : ",result);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminController = new AdminController(adminProviderUseCase, adminUserUseCase);
export { adminController };

