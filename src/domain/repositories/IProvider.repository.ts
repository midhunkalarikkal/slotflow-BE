import { Provider } from "../entities/provider.entity";

export interface IProviderRepository {
    createProvider(provider : Provider) : Promise<Provider>;
    findProviderByEmail(email : string) : Promise<Provider | null>;
    findAllProviders(): Promise<Partial<Provider>[]>;
    updateProviderVerificationStatus(providerId: string, isAdminVerified: boolean): Promise<Partial<Provider> | null>;
    getVerificationData(verificationToken: string): Promise<Provider | null>;
    updateProvider(user: Provider): Promise<Provider | null>;
    updateProviderStatus(providerId: string, status: boolean): Promise<Partial<Provider> | null>;
}