import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { DateZodSchema } from "../../infrastructure/zod/common.zod";
import { ProviderAddServiceAvailabilityZodSchema } from "../../infrastructure/zod/provider.zod";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ProviderAddServiceAvailabilitiesUseCase, ProviderFetchServiceAvailabilityUseCase } from "../../application/provider-use.case/providerServiceAvailability.use-case";

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
            const availabilities = ProviderAddServiceAvailabilityZodSchema.parse(req.body);
            if(!providerId || !availabilities || availabilities.length  === 0) throw new Error("Invalid request.");
            const result = await this.providerAddServiceAvailabilitiesUseCase.execute({providerId: new Types.ObjectId(providerId), availabilities});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async getServiceAvailability(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const validateQuery = DateZodSchema.parse(req.query);
            const { date } = validateQuery;
            if(!providerId || !date) throw new Error("Invalid request.");
            const result = await this.providerFetchServiceAvailabilityUseCase.execute({providerId: new Types.ObjectId(providerId), date: new Date(date)});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

}

const providerServiceAvailabilityController = new ProviderServiceAvailabilityController( providerAddServiceAvailabilitiesUseCase, providerFetchServiceAvailabilityUseCase );
export { providerServiceAvailabilityController };