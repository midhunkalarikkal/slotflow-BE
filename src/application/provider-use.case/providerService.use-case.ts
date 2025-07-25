import { Types } from 'mongoose';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from '../../config/env';
import { generateSignedUrl } from '../../config/aws_s3';
import { extractS3Key } from '../../infrastructure/helpers/helper';
import { ApiResponse } from '../../infrastructure/dtos/common.dto';
import { Validator } from '../../infrastructure/validator/validator';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';
import { ProviderServiceRepositoryImpl } from '../../infrastructure/database/providerService/providerService.repository.impl';
import { ProviderAddServiceDetailsRequest, ProviderFetchProviderServiceRequest, ProviderFetchProviderServiceResponse, ProviderFindProviderServiceResProps } from '../../infrastructure/dtos/provider.dto';


export class ProviderAddServiceDetailsUseCase {
    
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl, 
        private providerServiceRepositoryImpl: ProviderServiceRepositoryImpl,
        private s3: S3Client
    ){}

    async execute(payload: ProviderAddServiceDetailsRequest): Promise<ApiResponse> {
        
        const { providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, file } = payload;
        if(!providerId || !serviceCategory || !serviceName || !serviceDescription || !servicePrice || !providerAdhaar || !providerExperience || !file) throw new Error("Invalid Request.");
        
        Validator.validateObjectId(providerId, "providerId");
        Validator.validateObjectId(serviceCategory, "serviceCategoryId");
        Validator.validateServiceName(serviceName);
        Validator.validateServiceDescription(serviceDescription);
        Validator.validateServicePrice(servicePrice);   
        Validator.validateProviderAdhaar(String(providerAdhaar));
        Validator.validateProviderExperience(providerExperience);
        Validator.validateFile(file);
        
        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if(!provider) throw new Error("Please logout and try again.");

        try {
            const params = {
                Bucket: aws_s3Config.bucketName as string,
                Key: `providerCertificates/${providerId}.${file.originalname.split('.').pop()}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const upload = new Upload({
                client: this.s3,
                params: params,
            });

            const s3UploadResponse = await upload.done();
            if(!s3UploadResponse)throw new Error("Image uploading error, please try again");

            const providerService = await this.providerServiceRepositoryImpl.createProviderService({providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, providerCertificateUrl: s3UploadResponse.Location!})
            if(!providerService) throw new Error("Service details adding error.");

            if (provider && providerService && providerService._id) {
                provider.serviceId = providerService._id;
                const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
                if (!updatedProvider) throw new Error("Failed to update provider with service ID.");
            }

            return { success: true, message: 'Service details saved.' };

        } catch(error){
            throw new Error('Failed to save service details.')
        }
    }
}


export class ProviderFetchServiceDetailsUseCase {
    
    constructor(private provderServiceRepositoryImpl: ProviderServiceRepositoryImpl) { }

    async execute({ providerId }: ProviderFetchProviderServiceRequest): Promise<ApiResponse<ProviderFetchProviderServiceResponse>> {

        if (!providerId) throw new Error("Invalid request.");
        Validator.validateObjectId(providerId, "providerId");

        const service = await this.provderServiceRepositoryImpl.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        if(service === null) return { success: true, message: "Provider service details not yet addedd", data: {} };
        function isServiceData(obj: any): obj is ProviderFindProviderServiceResProps {
            return obj && typeof obj === 'object' && '_id' in obj;
        }
        
        if (!isServiceData(service)) {
            return { success: true, message: "Service fetched successfully.", data: {} };
        }

        const s3Key = await extractS3Key(service.providerCertificateUrl);
        const signedUrl = await generateSignedUrl(s3Key);
        service.providerCertificateUrl = signedUrl;
        
        const { createdAt, updatedAt, ...rest } = service;
        
        return { success: true, message: "Provider service details fetched", data: rest };
    }
}