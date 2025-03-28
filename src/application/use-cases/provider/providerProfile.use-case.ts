import { Types } from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../../config/env";
import { generateSignedUrl } from "../../../config/aws_s3";
import { Provider } from "../../../domain/entities/provider.entity";
import { extractS3Key } from "../../../infrastructure/helpers/helper";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

type ProviderFetchProfileDetailsResProps = Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt">;

export class ProviderFetchProfileDetailsUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, profileDetails: ProviderFetchProfileDetailsResProps | null }> {
        if (!providerId) throw new Error("Invalid request.");
        const provider = await this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
        if(provider === null) return { success: true, message: "Provider prfile not addedd.", profileDetails: null };
        if (!provider) throw new Error("Provider profile fetching error.");
        const { _id, password, addressId, serviceId, subscription, updatedAt, profileImage,  ...data } = provider;
        return { success: true, message: "Provider prfile detailed fetched.", profileDetails: data };
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