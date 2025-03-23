import { Types } from "mongoose";
import { ProviderService } from "../entities/providerService.entity";

export interface IProviderServiceRepository {
    createProviderService(providerService: ProviderService): Promise<ProviderService>;

    findProviderServiceByProviderId(providerId: Types.ObjectId): Promise<Partial<ProviderService> | null>;
}