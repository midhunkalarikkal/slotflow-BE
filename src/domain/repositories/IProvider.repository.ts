import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";

export type CreateProviderReqProps = Pick<Provider, "username" | "email" | "password" | "verificationToken">;
export type FindAllProvidersResProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;

export interface IProviderRepository {
    createProvider(provider : CreateProviderReqProps) : Promise<Provider | null>;

    verifyProvider(verificationToken: string): Promise<Provider | null>;
    
    updateProvider(user: Provider): Promise<Provider | null>;
    
    findProviderByEmail(email : string) : Promise<Provider | null>;
    
    findAllProviders(): Promise<FindAllProvidersResProps[] | null>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}