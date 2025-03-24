import { Types } from "mongoose";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { Address } from "../../../domain/entities/address.entity";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ServiceAvailability } from "../../../domain/entities/serviceAvailability.entity";
import { generateSignedUrl } from "../../../config/aws_s3";

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
            const providerData = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
            if (!providerData) throw new Error("Provider details fetching error, please try again.");
            const {addressId, subscription, serviceId, serviceAvailabilityId, verificationToken, password, ...provider } = providerData;
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
            const addressData = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
            if(!addressData) throw new Error("Address fetching error.");
            const {_id, userId, ...address} = addressData;
            return { success: true, message: "Address fetched successfully.", address }
        }catch(error){
            throw new Error("Provider Address fetching error, please try again.");
        }
    }
}

export class AdminFetchProviderServiceUseCase {
    constructor(private providerServiceRepository: ProviderServiceRepositoryImpl){ }

    async execute(providerId: string): Promise<{success: boolean, message: string, service: Partial<ProviderService>}> {
        try{
            if(!providerId) throw new Error("Invalid request.");
            const serviceData = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
            if(!serviceData) throw new Error("Service fetching error.");
            const {_id,  ...service} = serviceData;
            const providerCertifiacteUrl = service.providerCertificateUrl;
            if(!providerCertifiacteUrl) throw new Error("Service details fetching error.");
            const urlParts = providerCertifiacteUrl?.split('/');
            if(!urlParts) throw new Error("UrlParts error.");
            const s3Key = urlParts.slice(3).join('/');
            if(!s3Key) throw new Error("Image retrieving.");
            const signedUrl = await generateSignedUrl(s3Key);
            if(!signedUrl) throw new Error("Image fetching error.");
            service.providerCertificateUrl = signedUrl;
            return { success: true, message: "Service fetched successfully.", service}
        }catch(error){
            throw new Error("Provider service fetching error, please try again.");
        }
    }
}

export class AdminfetchProviderServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl){ }

    async execute(providerId: string): Promise<{success: boolean, message: string, availability: ServiceAvailability}> {
        try{
            if(!providerId) throw new Error("Invalid request.");
            const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
            if(!availability) throw new Error("Provider service availability fetching error.");
            return { success: true, message: "Service availability fetched successfully.", availability}
        }catch(error){
            throw new Error("Provider service availability fetching error.");
        }
    }
}
