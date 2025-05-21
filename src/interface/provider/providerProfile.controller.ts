import { Types } from "mongoose";
import { Request, Response } from "express";
import { s3Client } from "../../config/aws_s3";
import { HandleError } from "../../infrastructure/error/error";
import { UserOrProviderUpdateProviderInfoZodSchema } from "../../infrastructure/zod/common.zod";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchProfileDetailsUseCase, ProviderUpdateProfileImageUseCase, ProviderUpdateProviderInfoUseCase } from "../../application/provider-use.case/providerProfile.use-case";

const providerRepositoryImpl = new ProviderRepositoryImpl();

const providerFetchProfileDetailsUseCase = new ProviderFetchProfileDetailsUseCase(providerRepositoryImpl);
const providerUpdateProfileImageUseCase = new ProviderUpdateProfileImageUseCase(providerRepositoryImpl,s3Client);
const providerUpdateProviderInfoUseCase = new ProviderUpdateProviderInfoUseCase(providerRepositoryImpl);

class ProviderProfileController {
    constructor(
        private providerFetchProfileDetailsUseCase: ProviderFetchProfileDetailsUseCase,
        private providerUpdateProfileImageUseCase: ProviderUpdateProfileImageUseCase,
        private providerUpdateProviderInfoUseCase: ProviderUpdateProviderInfoUseCase,
    ) {
        this.getProfileDetails = this.getProfileDetails.bind(this);
        this.updateProfileImage = this.updateProfileImage.bind(this);
        this.updateProviderInfo = this.updateProviderInfo.bind(this);
    }

    async getProfileDetails(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchProfileDetailsUseCase.execute({providerId: new Types.ObjectId(providerId)});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async updateProfileImage(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const file = req.file;
            if(!providerId || !file) throw new Error("Invalid request.");
            const result = await this.providerUpdateProfileImageUseCase.execute({providerId: new Types.ObjectId(providerId), file});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async updateProviderInfo(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const validateData = UserOrProviderUpdateProviderInfoZodSchema.parse(req.body);
            const { username, phone } = validateData;
            if(!providerId || !username || !phone) throw new Error("Invalid request");
            const result = await this.providerUpdateProviderInfoUseCase.execute({
                 providerId: new Types.ObjectId(providerId),
                 username,
                 phone
                })
            res.status(200).json(result)
        } catch(error){ 
            HandleError.handle(error,res);
        }
    }
}

const providerProfileController = new ProviderProfileController( 
    providerFetchProfileDetailsUseCase, 
    providerUpdateProfileImageUseCase,
    providerUpdateProviderInfoUseCase
);

export { providerProfileController };