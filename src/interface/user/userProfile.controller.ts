import { Types } from "mongoose";
import { Request, Response } from "express";
import { s3Client } from "../../config/aws_s3";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { UserFetchProfileDetailsUseCase, UserUpdateProfileImageUseCase } from "../../application/user-use.case/userProfile.use-Case";


const userRepositoryImpl = new UserRepositoryImpl();

const userFetchProfileDetailsUseCase = new UserFetchProfileDetailsUseCase(userRepositoryImpl);
const userUpdateProfileImageUseCase = new UserUpdateProfileImageUseCase(userRepositoryImpl, s3Client);

export class UserProfileController {
    constructor(
        private userFetchProfileDetailsUseCase: UserFetchProfileDetailsUseCase,
        private userUpdateProfileImageUseCase: UserUpdateProfileImageUseCase,
    ){
        this.getProfileDetails = this.getProfileDetails.bind(this);
        this.updateProfileImage = this.updateProfileImage.bind(this);
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
    
}

const userProfileController = new UserProfileController( userFetchProfileDetailsUseCase, userUpdateProfileImageUseCase );
export { userProfileController };