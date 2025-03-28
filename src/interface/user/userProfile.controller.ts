import { Request, Response } from "express";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { HandleError } from "../../infrastructure/error/error";
import { UserFetchProfileDetailsUseCase } from "../../application/use-cases/user/userProfile.Use-Case";


const userRepositoryImpl = new UserRepositoryImpl();
const userFetchProfileDetailsUseCase = new UserFetchProfileDetailsUseCase(userRepositoryImpl);

export class UserProfileController {
    constructor(
        private userFetchProfileDetailsUseCase: UserFetchProfileDetailsUseCase,
    ){
        this.getProfileDetails = this.getProfileDetails.bind(this);
    }

    async getProfileDetails(req:Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            if(!userId) throw new Error("Invalid request.");
            const result = await this.userFetchProfileDetailsUseCase.execute(userId);
            console.log("result : ",result);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
    
}

const userProfileController = new UserProfileController( userFetchProfileDetailsUseCase );
export { userProfileController };