import { Request, Response } from "express";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { HandleError } from "../../infrastructure/error/error";
import { UserFetchProfileDetailsUseCase, UserUpdateProfileImageUseCase } from "../../application/use-cases/user/userProfile.Use-Case";
import { s3Client } from "../../config/aws_s3";


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
            const result = await this.userFetchProfileDetailsUseCase.execute(userId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async updateProfileImage(req: Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            const file = req.file;
            console.log("userId , file : ",userId, file);
            if(!userId || !file) throw new Error("Invalid request.");
            const result = await this.userUpdateProfileImageUseCase.execute(userId, file);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
    
}

const userProfileController = new UserProfileController( userFetchProfileDetailsUseCase, userUpdateProfileImageUseCase );
export { userProfileController };