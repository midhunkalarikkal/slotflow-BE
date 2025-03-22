import { Types } from "mongoose";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { Address } from "../../../domain/entities/address.entity";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";

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

export class AdminFetchProviderDetailsUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, provider: Partial<Provider> }> {
        try {
            if (!providerId) throw new Error("Invalid request.");
            const fetchingData = "_id username email isBlocked isEmailVerified isAdminVerified phone profileImage createdAt";
            const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId), fetchingData);
            if (!provider) throw new Error("Provider details fetching error, please try again.");
            return { success: true, message: "Provider details fetched", provider };
        } catch (error) {
            throw new Error("Provider details fetching error, please try again.");
        }
    }
}

export class AdminFetchProviderAddressUseCase {
    constructor(private addressRepository: AddressRepositoryImpl){ }

    async execute(providerId: string): Promise<{ success: boolean, message: string, address: Partial<Address>}> {
        try{
            if(!providerId) throw new Error("Invalid request.");
            const fetchingData = "_id addressLine place phone city district pincode state country googleMapLink"
            const address = await this.addressRepository.findByUserId(new Types.ObjectId(providerId),fetchingData);
            if(!address) throw new Error("Address fetching error.");
            return { success: true, message: "Address fetched successfully.", address }
        }catch(error){
            throw new Error("Provider Address fetching error, please try again.");
        }
    }
}
