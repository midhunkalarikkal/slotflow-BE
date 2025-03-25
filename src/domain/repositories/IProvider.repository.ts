import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";

export type CreateProviderReqProps = Pick<Provider, "username" | "email" | "password" | "verificationToken">;
export type FindAllProvidersResProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified">;
export type AdminApproveProviderResProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified">
export type AdminChangeProviderBlockStatusResProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified">

export interface IProviderRepository {
    createProvider(provider : CreateProviderReqProps) : Promise<Provider | null>;

    verifyProvider(verificationToken: string): Promise<Provider | null>;
    
    updateProvider(user: Provider): Promise<Provider | null>;
    
    findProviderByEmail(email : string) : Promise<Provider | null>;
    
    findAllProviders(): Promise<FindAllProvidersResProps[] | null>;
    
    updateProviderAdminApprovingStatus(providerId: Types.ObjectId, isAdminVerified: boolean): Promise<AdminApproveProviderResProps | null>;

    updateProviderBlockStatus(providerId: Types.ObjectId, status: boolean): Promise<AdminChangeProviderBlockStatusResProps | null>;

    checkProviderStatus(providerId: Types.ObjectId): Promise<Partial<Provider> | null>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}