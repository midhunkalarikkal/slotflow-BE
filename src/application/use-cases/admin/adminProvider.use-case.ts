import { Types } from "mongoose";
import { generateSignedUrl } from "../../../config/aws_s3";
import { Address } from "../../../domain/entities/address.entity";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { FindAllProvidersResProps } from "../../../domain/repositories/IProvider.repository";
import { ServiceAvailability } from "../../../domain/entities/serviceAvailability.entity";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { OTPService } from "../../../infrastructure/services/otp.service";


type AdminFetchProviderServiceAvailabilityResPros = Pick<ServiceAvailability, "availability">;
type AdminApproveProviderResProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified">
type AdminChangeProviderBlockStatusResProps = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified">

export class AdminProviderListUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(): Promise<{ success: boolean, message: string, providers: FindAllProvidersResProps[] }> {
        const providers = await this.providerRepository.findAllProviders();
        if (!providers) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", providers };
    }

}

export class AdminApproveProviderUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, updatedProvider: AdminApproveProviderResProps }> {
        if (!providerId) throw new Error("Invalid request");
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("User not found.");
        provider.isAdminVerified = true;
        const updatedProvider = await this.providerRepository.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        await OTPService.sendApprovalEmail(updatedProvider.email);
        const data = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
        };
        return { success: true, message: "Provider approved successfully.", updatedProvider: data };
    }
}

export class AdminChangeProviderStatusUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string, status: boolean): Promise<{ success: boolean, message: string, updatedProvider: AdminChangeProviderBlockStatusResProps }> {
        if (!providerId || status === null) throw new Error("Invalid request");
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("User not found.");
        provider.isBlocked = status;
        const updatedProvider = await this.providerRepository.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        const data = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
        };
        return { success: true, message: `Provider ${status ? "blocked" : "Unblocked"} successfully.`, updatedProvider: data };
    }
}

export class AdminFetchProviderDetailsUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, provider: Partial<Provider> | null }> {
        if (!providerId) throw new Error("Invalid request.");
        const providerData = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (providerData == null) return { success: true, message: "Provider details fetched", provider: null };
        const { addressId, subscription, serviceId, serviceAvailabilityId, verificationToken, password, updatedAt, ...provider } = providerData;
        return { success: true, message: "Provider details fetched", provider };
    }
}

export class AdminFetchProviderAddressUseCase {
    constructor(private addressRepository: AddressRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, address: Partial<Address> | null }> {
        if (!providerId) throw new Error("Invalid request.");
        const addressData = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
        if (addressData == null) return { success: true, message: "Address not yet added.", address: null }
        const { _id, ...address } = addressData;
        return { success: true, message: "Address fetched successfully.", address }
    }
}

export class AdminFetchProviderServiceUseCase {
    constructor(private providerServiceRepository: ProviderServiceRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, service: Partial<ProviderService> | null }> {
        if (!providerId) throw new Error("Invalid request.");
        const serviceData = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        if (serviceData == null) return { success: true, message: "Service fetched successfully.", service: null };
        const { _id, createdAt, updatedAt, ...service } = serviceData;
        const providerCertifiacteUrl = service.providerCertificateUrl;
        if (!providerCertifiacteUrl) throw new Error("Service details fetching error.");
        const urlParts = providerCertifiacteUrl?.split('/');
        if (!urlParts) throw new Error("UrlParts error.");
        const s3Key = urlParts.slice(3).join('/');
        if (!s3Key) throw new Error("Image retrieving.");
        const signedUrl = await generateSignedUrl(s3Key);
        if (!signedUrl) throw new Error("Image fetching error.");
        service.providerCertificateUrl = signedUrl;
        return { success: true, message: "Service fetched successfully.", service };
    }
}

export class AdminfetchProviderServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, availability: AdminFetchProviderServiceAvailabilityResPros | null }> {
        if (!providerId) throw new Error("Invalid request.");
        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (availability == null) return { success: true, message: "Service availability fetched successfully.", availability: null }
        const { _id, providerId: spId, createdAt, updatedAt, ...rest } = availability;
        return { success: true, message: "Service availability fetched successfully.", availability: rest }
    }
}
