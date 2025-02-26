import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminUseCase } from "../../application/use-cases/admin/admin.Use-Case";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const userRepositoryImpl = new UserRepositoryImpl();
const adminUseCase = new AdminUseCase(providerRepositoryImpl, userRepositoryImpl);

export class AdminController {
    constructor(
        private adminUseCase : AdminUseCase
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    async getAllProviders(req: Request, res: Response) {
        try{
            console.log("provider function")
            const result = await this.adminUseCase.providersList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try{
            console.log("user function")
            const result = await this.adminUseCase.usersList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

}

const adminController = new AdminController(adminUseCase);
export { adminController };

