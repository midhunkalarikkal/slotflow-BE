import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminUseCase } from "../../application/use-cases/admin/admin.Use-Case";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const adminUseCase = new AdminUseCase(providerRepositoryImpl);

export class AdminController {
    constructor(
        private adminUseCase : AdminUseCase
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
    }

    async getAllProviders(req: Request, res: Response) {
        try{
            const result = await this.adminUseCase.providersList();
            console.log("provider : ",result?.providers);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

}

const adminController = new AdminController(adminUseCase);
export { adminController };

