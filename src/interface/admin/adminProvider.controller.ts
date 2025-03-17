import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminProviderUseCase } from "../../application/use-cases/admin/adminProvider.use-case";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const adminProviderUseCase = new AdminProviderUseCase(providerRepositoryImpl);

class AdminProviderController {
    constructor(
        private adminProviderUseCase : AdminProviderUseCase,
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
        this.approveProvider = this.approveProvider.bind(this);
        this.changeProviderStatus = this.changeProviderStatus.bind(this);
    }

    async getAllProviders(req: Request, res: Response) {
        try{
            const result = await this.adminProviderUseCase.providersList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async approveProvider(req: Request, res: Response) {
        try{
            const { providerId } = req.params;
            if(!providerId) throw new Error("Invalid request.");
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
            if(!providerId || !status) throw new Error("Invalid request.");
            const statusValue = status === 'true';
            const result = await this.adminProviderUseCase.changeStatus(providerId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
   
}

const adminProviderController = new AdminProviderController(adminProviderUseCase);
export { adminProviderController };

