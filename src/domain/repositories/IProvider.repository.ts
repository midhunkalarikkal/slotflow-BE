import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";

export interface IProviderRepository {
    createProvider(provider : Partial<Provider>) : Promise<Partial<Provider> | null>;

    findProviderByEmail(email : string) : Promise<Provider | null>;

    findAllProviders(): Promise<Partial<Provider>[] | null>;

    updateProviderVerificationStatus(providerId: Types.ObjectId, isAdminVerified: boolean): Promise<Partial<Provider> | null>;

    getVerificationData(verificationToken: string): Promise<Provider | null>;

    updateProvider(user: Partial<Provider>): Promise<Partial<Provider> | null>;

    updateProviderStatus(providerId: Types.ObjectId, status: boolean): Promise<Partial<Provider> | null>;

    checkProviderStatus(providerId: Types.ObjectId): Promise<Partial<Provider> | null>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}