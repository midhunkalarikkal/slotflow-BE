import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";
import { AdiminFetchAllProviders } from "../../infrastructure/dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";

export type CreateProviderReqProps = Pick<Provider, "username" | "email" | "password" | "verificationToken">;

export interface IProviderRepository {
    createProvider(provider : CreateProviderReqProps) : Promise<Provider | null>;

    verifyProvider(verificationToken: string): Promise<Provider | null>;
    
    updateProvider(user: Provider): Promise<Provider | null>;
    
    findProviderByEmail(email : string) : Promise<Provider | null>;
    
    findAllProviders({page,limit}: ApiPaginationRequest): Promise<ApiResponse<AdiminFetchAllProviders>>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}