import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ProviderAddServiceAvailabilitiesUseCase, ProviderFetchServiceAvailabilityUseCase } from "../../application/use-cases/provider/providerServiceAvailability.use-case";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();

const providerAddServiceAvailabilitiesUseCase = new ProviderAddServiceAvailabilitiesUseCase(providerRepositoryImpl, serviceAvailabilityRepositoryImpl);
const providerFetchServiceAvailabilityUseCase = new ProviderFetchServiceAvailabilityUseCase(serviceAvailabilityRepositoryImpl);

class ProviderServiceAvailabilityController {
    constructor(
        private providerAddServiceAvailabilitiesUseCase: ProviderAddServiceAvailabilitiesUseCase,
        private providerFetchServiceAvailabilityUseCase: ProviderFetchServiceAvailabilityUseCase,
    ) {
        this.addServiceAvailability = this.addServiceAvailability.bind(this);
        this.getServiceAvailability = this.getServiceAvailability.bind(this);
    }

    async addServiceAvailability(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const availabilities = req.body;
            if(!providerId || !availabilities || availabilities.length  === 0) throw new Error("Invalid request.");
            const result = await this.providerAddServiceAvailabilitiesUseCase.execute(providerId, availabilities);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async getServiceAvailability(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchServiceAvailabilityUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

}

const providerServiceAvailabilityController = new ProviderServiceAvailabilityController( providerAddServiceAvailabilitiesUseCase, providerFetchServiceAvailabilityUseCase );
export { providerServiceAvailabilityController };