import { ProviderService } from "../entities/providerService.entity";

export interface IProviderServiceRepository {
    createProviderService(providerService: ProviderService): Promise<ProviderService>;
}