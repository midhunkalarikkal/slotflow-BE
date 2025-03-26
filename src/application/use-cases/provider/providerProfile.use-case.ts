import { Types } from "mongoose";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { Address } from "../../../domain/entities/address.entity";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { generateSignedUrl } from "../../../config/aws_s3";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ServiceAvailability } from "../../../domain/entities/serviceAvailability.entity";

type ProviderFetchProfileDetailsResProps = Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "profileImage" | "createdAt">;
type ProviderFetchAddressResProps = Pick<Address, "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;
type ProviderFetchServiceDetailsResProps = Pick<ProviderService, "_id" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl">;
type ProviderFetchServiceAvailabilityResProps = Pick<ServiceAvailability, "_id" |  "availability" >;

export class ProviderFetchProfileDetailsUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, provider: ProviderFetchProfileDetailsResProps }> {
        if (!providerId) throw new Error("Invalid request.");
        const provider = await this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("Provider profile fetching error.");
        const { _id, password, addressId, serviceId, subscription, updatedAt, ...rest } = provider;
        return { success: true, message: "Provider prfile detailed fetched.", provider: rest };
    }
}


export class ProviderFetchAddressUseCase {
    constructor(private addressRepository: AddressRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, address: ProviderFetchAddressResProps }> {
        if (!providerId) throw new Error("Invalid request.");
        const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
        if (!address) throw new Error("Provider address fetching error.");
        const { userId, createdAt, updatedAt, ...rest } = address;
        return { success: true, message: "Provider address fetched.", address: rest };
    }
}

export class ProviderFetchServiceDetailsUseCase {
    constructor(private provderServiceRepository: ProviderServiceRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, service: ProviderFetchServiceDetailsResProps }> {
        if (!providerId) throw new Error("Invalid request.");
        const service = await this.provderServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        if (!service) throw new Error("Provider service fetching error.");

        const providerCertifiacteUrl = service.providerCertificateUrl;
        if (!providerCertifiacteUrl) throw new Error("Service details fetching error.");
        const urlParts = providerCertifiacteUrl?.split('/');
        if (!urlParts) throw new Error("UrlParts error.");
        const s3Key = urlParts.slice(3).join('/');
        if (!s3Key) throw new Error("Image retrieving.");
        const signedUrl = await generateSignedUrl(s3Key);
        service.providerCertificateUrl = signedUrl;
        const { createdAt, updatedAt, ...rest } = service;
        return { success: true, message: "Provider service details fetched", service: rest };
    }
}

export class ProviderFetchServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl) { }

    async execute(providerId: string): Promise<{success: boolean, message: string, availability: ProviderFetchServiceAvailabilityResProps}> {
        if(!providerId) throw new Error("Invalid request.");
        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if(!availability) throw new Error("Provider service availability fetching error.");
        const {providerId : pId, createdAt, updatedAt, ...rest} = availability;
        return { success: true, message: "Provider service availability fetched.", availability: rest};
    }
}