import { Provider } from "../entities/provider.entity";

export interface IProviderRepository {
    createProvider(provider : Provider) : Promise<Provider | null>;
    findProviderByEmail(email : string) : Promise<Provider | null>;
    findAllProviders(): Promise<Partial<Provider>[] | null>;
    updateProviderVerificationStatus(providerId: string, isAdminVerified: boolean): Promise<Partial<Provider> | null>;
    getVerificationData(verificationToken: string): Promise<Provider | null>;
    updateProvider(user: Provider): Promise<Provider | null>;
    updateProviderStatus(providerId: string, status: boolean): Promise<Partial<Provider> | null>;
    checkProviderStatus(providerId: string): Promise<boolean | null>;
    findProviderById(providerId: string): Promise<Provider | null>;
}