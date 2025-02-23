import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class AdminUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) {}

    async providersList(): Promise<{success : boolean, message: string, providers?: Provider[]}>{
        const providers = await this.providerRepository.findAllProviders();
        
        if (providers.length === 0) {
            return { success: true, message: "No service providers found in database." };
        }

        return { success: true, message: "Fetched providers.", providers };
    }
}