import { Provider } from "../entities/provider.entity";

export interface IProviderRepository {
    createProvider(provider : Provider) : Promise<Provider>;
    findProviderByEmail(email : string) : Promise<Provider | null>;
    findAllProviders(): Promise<Provider[]>;
    updateProviderVerificationStatus(providerId: string, isAdminVerified: boolean): Promise<Provider | null>;
    getVerificationData(verificationToken: string): Promise<Provider | null>;
    updateProvider(user: Provider): Promise<Provider | null>;
}