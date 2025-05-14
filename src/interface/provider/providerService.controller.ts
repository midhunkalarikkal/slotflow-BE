import { Request, Response } from "express";
import { s3Client } from "../../config/aws_s3";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ProviderAddServiceDetailsUseCase, ProviderFetchServiceDetailsUseCase } from "../../application/provider-use.case/providerService.use-case";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();

const providerAddServiceDetailsUseCase = new ProviderAddServiceDetailsUseCase(providerRepositoryImpl, providerServiceRepositoryImpl, s3Client);
const providerFetchServiceDetailsUseCase = new ProviderFetchServiceDetailsUseCase(providerServiceRepositoryImpl);

class ProviderServiceController {
    constructor(
        private providerAddServiceDetailsUseCase: ProviderAddServiceDetailsUseCase,
        private providerFetchServiceDetailsUseCase: ProviderFetchServiceDetailsUseCase,
    ) {
        this.addServiceDetails = this.addServiceDetails.bind(this);
        this.getServiceDetails = this.getServiceDetails.bind(this);
    }

    async addServiceDetails(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const { serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience } = req.body;
            const file = req.file;
            if (!providerId || !serviceCategory || !serviceName || !serviceDescription || !servicePrice || !providerAdhaar || !providerExperience || !file) throw new Error("Invalid Request.");
            const result = await this.providerAddServiceDetailsUseCase.execute(providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, file);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async getServiceDetails(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            if (!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchServiceDetailsUseCase.execute(providerId);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

}

const providerServiceController = new ProviderServiceController( providerAddServiceDetailsUseCase, providerFetchServiceDetailsUseCase );
export { providerServiceController };