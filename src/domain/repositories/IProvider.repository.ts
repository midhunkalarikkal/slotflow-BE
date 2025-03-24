import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";

export type CreateProviderProps = Pick<Provider, "username" | "email" | "password" | "verificationToken">;
export type FindAllProvidersProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified">;

export interface IProviderRepository {
    createProvider(provider : CreateProviderProps) : Promise<Provider | null>;

    verifyProvider(verificationToken: string): Promise<Provider | null>;
    
    updateProvider(user: Provider): Promise<Provider | null>;
    
    findProviderByEmail(email : string) : Promise<Provider | null>;
    
    findAllProviders(): Promise<FindAllProvidersProps[] | null>;
    
    updateProviderVerificationStatus(providerId: Types.ObjectId, isAdminVerified: boolean): Promise<Partial<Provider> | null>;

    updateProviderStatus(providerId: Types.ObjectId, status: boolean): Promise<Partial<Provider> | null>;

    checkProviderStatus(providerId: Types.ObjectId): Promise<Partial<Provider> | null>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}