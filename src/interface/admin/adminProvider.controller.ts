import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { AdminApproveProviderUseCase, AdminChangeProviderStatusUseCase, AdminChangeProviderTrustTagUseCase, AdminFetchProviderAddressUseCase, AdminFetchProviderDetailsUseCase, AdminfetchProviderServiceAvailabilityUseCase, AdminFetchProviderServiceUseCase, AdminProviderListUseCase } from "../../application/use-cases/admin/adminProvider.use-case";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const serviceAvailabilityImpl = new ServiceAvailabilityRepositoryImpl();
const adminProviderListUseCase = new AdminProviderListUseCase(providerRepositoryImpl);
const adminApproveProviderUseCase = new AdminApproveProviderUseCase(providerRepositoryImpl);
const adminChangeProviderStatusUseCase = new AdminChangeProviderStatusUseCase(providerRepositoryImpl);
const adminChangeProviderTrustTagUseCase = new AdminChangeProviderTrustTagUseCase(providerRepositoryImpl);
const adminFetchProviderDetailsUseCase = new AdminFetchProviderDetailsUseCase(providerRepositoryImpl);
const adminFetchProviderAddressUseCase = new AdminFetchProviderAddressUseCase(addressRepositoryImpl);
const adminFetchProviderServiceUseCase = new AdminFetchProviderServiceUseCase(providerServiceRepositoryImpl);
const adminFetchProviderServiceAvailabilityUseCase = new AdminfetchProviderServiceAvailabilityUseCase(serviceAvailabilityImpl);

class AdminProviderController {
    constructor(
        private adminProviderListUseCase : AdminProviderListUseCase,
        private adminApproveProviderUseCase : AdminApproveProviderUseCase,
        private adminChangeProviderStatusUseCase : AdminChangeProviderStatusUseCase,
        private adminChangeProviderTrustTagUseCase : AdminChangeProviderTrustTagUseCase,
        private adminFetchProviderDetailsUseCase : AdminFetchProviderDetailsUseCase,
        private adminFetchProviderAddressUseCase : AdminFetchProviderAddressUseCase,
        private adminFetchProviderServiceUseCase : AdminFetchProviderServiceUseCase,
        private adminFetchProviderServiceAvailabilityUseCase : AdminfetchProviderServiceAvailabilityUseCase,
    ){
        this.getAllProviders = this.getAllProviders.bind(this);
        this.approveProvider = this.approveProvider.bind(this);
        this.changeProviderStatus = this.changeProviderStatus.bind(this);
        this.fetchProviderDetails = this.fetchProviderDetails.bind(this);
        this.fetchProviderAddress = this.fetchProviderAddress.bind(this);
        this.fetchProviderService = this.fetchProviderService.bind(this);
        this.fetchProviderServiceAvailability = this.fetchProviderServiceAvailability.bind(this);
        this.changeProviderTrustedTag = this.changeProviderTrustedTag.bind(this);
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
            const { providerId } = req.body;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.adminApproveProviderUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeProviderStatus(req: Request, res: Response) {
        try{
            const { providerId, status } = req.body;
            if(!providerId || status === null) throw new Error("Invalid request.");
            const result = await this.adminChangeProviderStatusUseCase.execute(providerId, status);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeProviderTrustedTag(req: Request, res: Response) {
        try{
            const { providerId, trustedBySlotflow } = req.body;
            if(!providerId || trustedBySlotflow === null || undefined) throw new Error("Invalid request.");
            const result = await this.adminChangeProviderTrustTagUseCase.execute(providerId, trustedBySlotflow);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error,res);
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

    async fetchProviderService(req:Request, res:Response) {
        try{
            const { providerId } = req.params;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.adminFetchProviderServiceUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async fetchProviderServiceAvailability(req:Request, res: Response) {
        try{
            const { providerId } = req.params;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.adminFetchProviderServiceAvailabilityUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
   
}

const adminProviderController = new AdminProviderController(adminProviderListUseCase, adminApproveProviderUseCase, adminChangeProviderStatusUseCase, adminChangeProviderTrustTagUseCase,adminFetchProviderDetailsUseCase, adminFetchProviderAddressUseCase, adminFetchProviderServiceUseCase, adminFetchProviderServiceAvailabilityUseCase);
export { adminProviderController };

