import { Types } from "mongoose";
import { ProviderService } from "../entities/providerService.entity";

export interface IProviderServiceRepository {
    createProviderService(providerService: ProviderService): Promise<ProviderService>;

    findByProviderId(providerId: Types.ObjectId, fetchingData: string): Promise<Partial<ProviderService> | null>;
}