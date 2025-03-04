import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class AdminProviderUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) {}

    async providersList(): Promise<{success : boolean, message: string, providers?: Provider[]}>{
        try{
            const providers = await this.providerRepository.findAllProviders();
            if(!providers) throw new Error("Fetching error, please try again.");
            return { success: true, message: "Fetched providers.", providers };
        }catch(error){
            throw new Error("Unexpected error occurred, please try again.");
        }
    }
    
    async approveProvider(providerId: string): Promise<{success: boolean, message: string, updatedProvider: Provider}>{
        try {
            if(!providerId) throw new Error("Invalid request");
            const updatedProvider = await this.providerRepository.updateProviderVerificationStatus(providerId, true);
            if (!updatedProvider) throw new Error("Provider not found");
            return { success: true, message: "Provider approved successfully.", updatedProvider};
        } catch (error) {
            throw new Error("Unexpected error occurred, please try again.");
        }
    }

    async changeStatus(providerId: string, status: boolean): Promise<{success: boolean, message: string, updatedProvider: Partial<Provider>}>{
        try {
            if(!providerId) throw new Error("Invalid request");
            const updatedProvider = await this.providerRepository.updateProviderStatus(providerId, status);
            if (!updatedProvider) throw new Error("Provider not found");
            return { success: true, message: "Provider approved successfully.", updatedProvider};
        } catch (error) {
            throw new Error("Unexpected error occurred, please try again.");
        }
    }
}