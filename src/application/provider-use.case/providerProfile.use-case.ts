import { Types } from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../config/env";
import { generateSignedUrl } from "../../config/aws_s3";
import { extractS3Key } from "../../infrastructure/helpers/helper";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchProfileDetailsUseCaseRequestPayload, ProviderFetchProfileDetailsUseCaseResponse, ProviderUpdateprofileImageRequestPayload, ProviderUpdateprofileImageResponse } from "../../infrastructure/dtos/provider.dto";


export class ProviderFetchProfileDetailsUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: ProviderFetchProfileDetailsUseCaseRequestPayload): Promise<ProviderFetchProfileDetailsUseCaseResponse> {
        const { providerId } = data;
        if (!providerId) throw new Error("Invalid request.");
        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(provider === null) return { success: true, message: "Provider prfile not addedd.", profileDetails: {} };
        if (!provider) throw new Error("Provider profile fetching error.");
        const { _id, password, addressId, serviceId, subscription, updatedAt, profileImage,  ...rest } = provider;
        return { success: true, message: "Provider prfile detailed fetched.", profileDetails: rest };
    }
}


export class ProviderUpdateProfileImageUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private s3: S3Client,
    ) { }

    async execute(data: ProviderUpdateprofileImageRequestPayload): Promise<ProviderUpdateprofileImageResponse> {
        const { providerId, file } = data;
        if (!providerId || !file) throw new Error("Invalid request.");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
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
            const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
            if (!updatedProvider) throw new Error("Profile image returning failed.");

            const s3Key = await extractS3Key(updatedProvider.profileImage);
            const signedUrl = await generateSignedUrl(s3Key);
            return { success: true, message: "Profile Image updated successfully.", profileImage: signedUrl };

        } catch {
            throw new Error("Unexpected error occured while updating profile image.");
        }
    }
}