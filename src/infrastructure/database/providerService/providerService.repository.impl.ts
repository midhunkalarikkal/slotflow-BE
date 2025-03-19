import { IProviderService, ProviderServiceModel } from "./providerService.model";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { IProviderServiceRepository } from "../../../domain/repositories/IProviderService.repository";

export class ProviderServiceRepositoryImpl implements IProviderServiceRepository {
    private mapToEntity(providerService: IProviderService): ProviderService {
        return new ProviderService(
            providerService.providerId,
            providerService.serviceCategory,
            providerService.serviceName,
            providerService.serviceDescription,
            providerService.servicePrice,
            providerService.providerAdhaar,
            providerService.providerExperience,
            providerService.providerCertificateUrl,
            providerService._id,
        );
    }

    async createProviderService(providerService: ProviderService): Promise<ProviderService> {
        try{
            const newProviderService = await ProviderServiceModel.create(providerService);
            return newProviderService;
        }catch(error){
            throw new Error("Service details adding error.");
        }
    }
}