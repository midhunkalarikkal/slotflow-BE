import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { AdminApproveProviderUseCase, AdminChangeProviderStatusUseCase, AdminFetchProviderAddressUseCase, AdminFetchProviderDetailsUseCase, AdminProviderListUseCase } from "../../application/use-cases/admin/adminProvider.use-case";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const adminProviderListUseCase = new AdminProviderListUseCase(providerRepositoryImpl);
const adminApproveProviderUseCase = new AdminApproveProviderUseCase(providerRepositoryImpl);
const adminChangeProviderStatusUseCase = new AdminChangeProviderStatusUseCase(providerRepositoryImpl);
const adminFetchProviderDetailsUseCase = new AdminFetchProviderDetailsUseCase(providerRepositoryImpl);
const adminFetchProviderAddressUseCase = new AdminFetchProviderAddressUseCase(addressRepositoryImpl);

class AdminProviderController {
    constructor(
        private adminProviderListUseCase : AdminProviderListUseCase,
        private adminApproveProviderUseCase : AdminApproveProviderUseCase,
        private adminChangeProviderStatusUseCase : AdminChangeProviderStatusUseCase,
        private adminFetchProviderDetailsUseCase : AdminFetchProviderDetailsUseCase,
        private adminFetchProviderAddressUseCase : AdminFetchProviderAddressUseCase,
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
        this.approveProvider = this.approveProvider.bind(this);
        this.changeProviderStatus = this.changeProviderStatus.bind(this);
        this.fetchProviderDetails = this.fetchProviderDetails.bind(this);
        this.fetchProviderAddress = this.fetchProviderAddress.bind(this);
    }

    async getAllProviders(req: Request, res: Response) {
        try{
            const result = await this.adminProviderListUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async approveProvider(req: Request, res: Response) {
        try{
            const { providerId } = req.params;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.adminApproveProviderUseCase.execute(providerId);
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
            const result = await this.adminChangeProviderStatusUseCase.execute(providerId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async fetchProviderDetails(req:Request, res: Response) {
        try{
            const { providerId } = req.params;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.adminFetchProviderDetailsUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async fetchProviderAddress(req:Request, res: Response) {
        try{
            const { providerId } = req.params;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.adminFetchProviderAddressUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
   
}

const adminProviderController = new AdminProviderController(adminProviderListUseCase, adminApproveProviderUseCase, adminChangeProviderStatusUseCase, adminFetchProviderDetailsUseCase, adminFetchProviderAddressUseCase);
export { adminProviderController };

