import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../config/env";
import { 
    ProviderUpdateProviderInfoRequest,
    ProviderUpdateprofileImageResponse, 
    ProviderFetchProfileDetailsRequest,
    ProviderUpdateProviderInfoResponse, 
    ProviderFetchProfileDetailsResponse, 
    ProviderUpdateprofileImageRequestPayload, 
} from "../../infrastructure/dtos/provider.dto";
import { generateSignedUrl } from "../../config/aws_s3";
import { ApiResponse } from "../../infrastructure/dtos/common.dto";
import { extractS3Key } from "../../infrastructure/helpers/helper";
import { validateOrThrow, Validator } from "../../infrastructure/validator/validator";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";


export class ProviderFetchProfileDetailsUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute({ providerId }: ProviderFetchProfileDetailsRequest): Promise<ApiResponse<ProviderFetchProfileDetailsResponse>> {
        
        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(provider === null) return { success: true, message: "Provider prfile not addedd.", data: {} };
        if (!provider) throw new Error("Provider profile fetching error.");
        const { _id, password, addressId, serviceId, subscription, updatedAt, profileImage,  ...rest } = provider;
        return { success: true, message: "Provider prfile detailed fetched.", data: rest };
    }
}


export class ProviderUpdateProfileImageUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private s3: S3Client,
    ) { }

    async execute({ providerId, file }: ProviderUpdateprofileImageRequestPayload): Promise<ApiResponse<ProviderUpdateprofileImageResponse>> {

        if (!providerId || !file) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateFile(file);

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
            return { success: true, message: "Profile Image updated successfully.", data: signedUrl };

        } catch {
            throw new Error("Unexpected error occured while updating profile image.");
        }
    }
}

export class ProviderUpdateProviderInfoUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl
    ) { }

    async execute({ providerId, username, phone }: ProviderUpdateProviderInfoRequest) : Promise<ApiResponse<ProviderUpdateProviderInfoResponse>> {

        if(!providerId || !username || !phone) throw new Error("Invalid request");

        Validator.validateObjectId(providerId,"providerId");
        Validator.validatePhone(phone);
        validateOrThrow("username",username);

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(!provider) throw new Error("No user found");

        const providerData = {
            ...provider,
            username: username,
            phone: phone
        }

        const updatedProvider = await this.providerRepositoryImpl.updateProvider(providerData);
        if(!updatedProvider) throw new Error("Info adding failed, please try again");

        const updatedData = { username: updatedProvider.username, phone: updatedProvider.phone };

        return { success: true, message: "Info updated successfully", data: updatedData }
    }
}