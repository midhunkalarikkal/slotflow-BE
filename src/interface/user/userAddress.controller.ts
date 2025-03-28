import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { UserFetchAddressUseCase } from "../../application/use-cases/user/userAddress.use-case";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();

const userFetchAddressUseCase = new UserFetchAddressUseCase(userRepositoryImpl, addressRepositoryImpl);
export class UserAddressController {
    constructor(
        private userFetchAddressUseCase: UserFetchAddressUseCase,
    ){
        this.getAddress = this.getAddress.bind(this);
    }

    async getAddress(req: Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            if(!userId) throw new Error("Invalid request.");
            const result = await this.userFetchAddressUseCase.execute(userId);
            console.log("result : ",result);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
}

const userAddressController = new UserAddressController( userFetchAddressUseCase );
export { userAddressController };