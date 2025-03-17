import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from '../../../config/env';
import { Validator } from '../../../infrastructure/validator/validator';
import { ProviderServiceRepositoryImpl } from '../../../infrastructure/database/providerService/providerService.repository.impl';

export class ProviderAddServiceDetailsUseCase {
    
    constructor(
        private providerServiceRepository: ProviderServiceRepositoryImpl,
        private s3: S3Client
    ){}

    async execute(providerId: string, serviceCategory: string, serviceName: string, serviceDescription: string, servicePrice: number, providerAdhaar: string, providerExperience: string, file: Express.Multer.File): Promise<{success:boolean, message: string}> {
        console.log("Call");
        if(!providerId || !serviceCategory || !serviceName || !serviceDescription || !servicePrice || !providerAdhaar || !providerExperience || !file) throw new Error("Invalid Request.");
        Validator.validateServiceName(serviceName);
        Validator.validateServiceDescription(serviceDescription);
        Validator.validateServicePrice(Number(servicePrice));   
        Validator.validateProviderAdhaar(providerAdhaar);
        Validator.validateProviderExperience(providerExperience);
        console.log(providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, file)
        
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
            console.log("s3UploadResponse : ",s3UploadResponse);
            if(!s3UploadResponse)throw new Error("Image uploading error, please try again");
            const result = await this.providerServiceRepository.createProviderService({providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, providerCertificateUrl: s3UploadResponse.Location!})
            if(!result) throw new Error("Service details adding error.");
            return { success: true, message: 'Service details saved.' };
        } catch(error){
            console.log("error : ",error);
            throw new Error('Failed to save service details.')
        }
    }
}