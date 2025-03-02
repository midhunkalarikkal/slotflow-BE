import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class AdminProviderUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) {}

    async providersList(): Promise<{success : boolean, message: string, providers?: Provider[]}>{
        const providers = await this.providerRepository.findAllProviders();
        if(!providers) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", providers };
    }
    
}