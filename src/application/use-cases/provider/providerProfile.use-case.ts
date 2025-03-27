import { Types } from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../../config/env";
import { generateSignedUrl } from "../../../config/aws_s3";
import { Address } from "../../../domain/entities/address.entity";
import { Provider } from "../../../domain/entities/provider.entity";
import { extractS3Key } from "../../../infrastructure/helpers/helper";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { ServiceAvailability } from "../../../domain/entities/serviceAvailability.entity";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";

type ProviderFetchProfileDetailsResProps = Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "profileImage" | "createdAt">;
type ProviderFetchAddressResProps = Pick<Address, "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;
type ProviderFetchServiceDetailsResProps = Pick<ProviderService, "_id" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl">;
type ProviderFetchServiceAvailabilityResProps = Pick<ServiceAvailability, "_id" | "availability">;

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

        const s3Key = await extractS3Key(service.providerCertificateUrl);
        const signedUrl = await generateSignedUrl(s3Key);
        service.providerCertificateUrl = signedUrl;
        const { createdAt, updatedAt, ...rest } = service;
        return { success: true, message: "Provider service details fetched", service: rest };
    }
}

export class ProviderFetchServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, availability: ProviderFetchServiceAvailabilityResProps }> {
        if (!providerId) throw new Error("Invalid request.");
        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (!availability) throw new Error("Provider service availability fetching error.");
        const { providerId: pId, createdAt, updatedAt, ...rest } = availability;
        return { success: true, message: "Provider service availability fetched.", availability: rest };
    }
}

export class ProviderUpdateProfileImageUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private s3: S3Client,
    ) { }

    async execute(providerId: string, file: Express.Multer.File): Promise<{ success: boolean, message: string, profileImage: string }> {
        if (!providerId || !file) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("No user found, please try again.");

        try {
            const params = {
                Bucket: aws_s3Config.bucketName as string,
                Key: `providerProfileImages/${providerId}.${file.originalname.split('.').pop()}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const upload = new Upload({
                client: this.s3,
                params: params,
            });

            const s3UploadResponse = await upload.done();
            if (!s3UploadResponse) throw new Error("Image uploading error, please try again");

            provider.profileImage = s3UploadResponse.Location ?? "";
            const updatedProvider = await this.providerRepository.updateProvider(provider);
            if (!updatedProvider) throw new Error("Profile image returning failed.");

            const s3Key = await extractS3Key(updatedProvider.profileImage);
            const signedUrl = await generateSignedUrl(s3Key);
            return { success: true, message: "Profile Image updated successfully.", profileImage: signedUrl };

        } catch {
            throw new Error("Unexpected error occured while updating profile image.");
        }
    }
}