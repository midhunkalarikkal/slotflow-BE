import { Types } from "mongoose";
import { Provider } from "../entities/provider.entity";
import { AdiminFetchAllProviders } from "../../infrastructure/dtos/admin.dto";
import { CreateProviderRequest } from "../../infrastructure/dtos/provider.dto";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";


export interface IProviderRepository {
    createProvider(provider : CreateProviderRequest) : Promise<Provider | null>;

    verifyProvider(verificationToken: string): Promise<Provider | null>;
    
    updateProvider(user: Provider): Promise<Provider | null>;
    
    findProviderByEmail(email : string) : Promise<Provider | null>;
    
    findAllProviders({page,limit}: ApiPaginationRequest): Promise<ApiResponse<AdiminFetchAllProviders>>;
    
    findProviderById(providerId: Types.ObjectId): Promise<Provider | null>;
}