import { Types } from "mongoose";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class AdminProviderListUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(): Promise<{ success: boolean, message: string, providers?: Partial<Provider>[] }> {
        try {
            const providers = await this.providerRepository.findAllProviders();
            if (!providers) throw new Error("Fetching error, please try again.");
            return { success: true, message: "Fetched providers.", providers };
        } catch (error) {
            throw new Error("Unexpected error occurred, please try again.");
        }
    }

}

export class AdminApproveProviderUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, updatedProvider: Partial<Provider> }> {
        try {
            if (!providerId) throw new Error("Invalid request");
            const updatedProvider = await this.providerRepository.updateProviderVerificationStatus(new Types.ObjectId(providerId), true);
            if (!updatedProvider) throw new Error("Provider not found");
            return { success: true, message: "Provider approved successfully.", updatedProvider };
        } catch (error) {
            throw new Error("Unexpected error occurred, please try again.");
        }
    }

}

export class AdminChangeProviderStatusUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string, status: boolean): Promise<{ success: boolean, message: string, updatedProvider: Partial<Provider> }> {
        try {
            if (!providerId || status === null) throw new Error("Invalid request");
            const updatedProvider = await this.providerRepository.updateProviderStatus(new Types.ObjectId(providerId), status);
            if (!updatedProvider) throw new Error("Provider not found");
            return { success: true, message: `Provider ${status ? "blocked" : "Unblocked"} successfully.`, updatedProvider };
        } catch (error) {
            throw new Error("Unexpected error occurred, please try again.");
        }
    }
}