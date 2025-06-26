import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";
import { AdiminFindAllProviders } from "../../infrastructure/dtos/admin.dto";
import { ApiRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";

export type CreateProviderReqProps = Pick<Provider, "username" | "email" | "password" | "verificationToken">;

export interface IProviderRepository {
    createProvider(provider : CreateProviderReqProps) : Promise<Provider | null>;

    verifyProvider(verificationToken: string): Promise<Provider | null>;
    
    updateProvider(user: Provider): Promise<Provider | null>;
    
    findProviderByEmail(email : string) : Promise<Provider | null>;
    
    findAllProviders({page,limit}: ApiRequest): Promise<ApiResponse<AdiminFindAllProviders>>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}