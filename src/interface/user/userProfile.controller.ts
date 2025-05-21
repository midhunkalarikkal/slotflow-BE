import { Types } from "mongoose";
import { Request, Response } from "express";
import { s3Client } from "../../config/aws_s3";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { UserOrProviderUpdateProviderInfoZodSchema } from "../../infrastructure/zod/common.zod";
import { UserFetchProfileDetailsUseCase, UserUpdateProfileImageUseCase, UserUpdateProviderInfoUseCase } from "../../application/user-use.case/userProfile.use-Case";

const userRepositoryImpl = new UserRepositoryImpl();

const userFetchProfileDetailsUseCase = new UserFetchProfileDetailsUseCase(userRepositoryImpl);
const userUpdateProfileImageUseCase = new UserUpdateProfileImageUseCase(userRepositoryImpl, s3Client);
const userUpdateProviderInfoUseCase = new UserUpdateProviderInfoUseCase(userRepositoryImpl);

export class UserProfileController {
    constructor(
        private userFetchProfileDetailsUseCase: UserFetchProfileDetailsUseCase,
        private userUpdateProfileImageUseCase: UserUpdateProfileImageUseCase,
        private userUpdateProviderInfoUseCase: UserUpdateProviderInfoUseCase,
    ){
        this.getProfileDetails = this.getProfileDetails.bind(this);
        this.updateProfileImage = this.updateProfileImage.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
    }

    async getProfileDetails(req:Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            if(!userId) throw new Error("Invalid request.");
            const result = await this.userFetchProfileDetailsUseCase.execute({userId: new Types.ObjectId(userId)});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async updateProfileImage(req: Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            const file = req.file;
            if(!userId || !file) throw new Error("Invalid request.");
            const result = await this.userUpdateProfileImageUseCase.execute({userId: new Types.ObjectId(userId), file});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async updateUserInfo(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateData = UserOrProviderUpdateProviderInfoZodSchema.parse(req.body);
            const { username, phone } = validateData;
            if(!userId || !username || !phone) throw new Error("Invalid request");
            const result = await this.userUpdateProviderInfoUseCase.execute({
                 userId: new Types.ObjectId(userId),
                 username,
                 phone
                })
            res.status(200).json(result)
        } catch(error){ 
            HandleError.handle(error,res);
        }
    }
    
}

const userProfileController = new UserProfileController( 
    userFetchProfileDetailsUseCase, 
    userUpdateProfileImageUseCase,
    userUpdateProviderInfoUseCase,
);
export { userProfileController };