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
        );
    }

    async createProviderService(providerService: ProviderService): Promise<boolean> {
        try{
            const newProviderService = await ProviderServiceModel.create(providerService);
            return newProviderService ? true : false;
        }catch(error){
            throw new Error("Service details adding error.");
        }
    }
}