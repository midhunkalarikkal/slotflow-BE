import { Types } from 'mongoose';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from '../../../config/env';
import { Validator } from '../../../infrastructure/validator/validator';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';
import { ProviderServiceRepositoryImpl } from '../../../infrastructure/database/providerService/providerService.repository.impl';
import { extractS3Key } from '../../../infrastructure/helpers/helper';
import { generateSignedUrl } from '../../../config/aws_s3';
import { ProviderService } from '../../../domain/entities/providerService.entity';

type ProviderFetchServiceDetailsResProps = Pick<ProviderService, "_id" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl">;

export class ProviderAddServiceDetailsUseCase {
    
    constructor(
        private providerRepository: ProviderRepositoryImpl, 
        private providerServiceRepository: ProviderServiceRepositoryImpl,
        private s3: S3Client
    ){}

    async execute(providerId: string, serviceCategory: string, serviceName: string, serviceDescription: string, servicePrice: number, providerAdhaar: string, providerExperience: string, file: Express.Multer.File): Promise<{success:boolean, message: string }> {

        if(!providerId || !serviceCategory || !serviceName || !serviceDescription || !servicePrice || !providerAdhaar || !providerExperience || !file) throw new Error("Invalid Request.");
        Validator.validateServiceName(serviceName);
        Validator.validateServiceDescription(serviceDescription);
        Validator.validateServicePrice(Number(servicePrice));   
        Validator.validateProviderAdhaar(providerAdhaar);
        Validator.validateProviderExperience(providerExperience);
        
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
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

            const providerService = await this.providerServiceRepository.createProviderService({providerId: new Types.ObjectId(providerId), serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, providerCertificateUrl: s3UploadResponse.Location!})
            if(!providerService) throw new Error("Service details adding error.");


            if (provider && providerService && providerService._id) {
                provider.serviceId = providerService._id;
                const updatedProvider = await this.providerRepository.updateProvider(provider);
                if (!updatedProvider) throw new Error("Failed to update provider with service ID.");
            }

            return { success: true, message: 'Service details saved.' };

        } catch(error){
            console.log("error : ",error);
            throw new Error('Failed to save service details.')
        }
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