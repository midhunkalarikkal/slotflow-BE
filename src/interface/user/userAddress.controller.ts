import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AddAddressZodSchema } from "../../infrastructure/zod/common.zod";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { UserAddAddressUseCase, UserFetchAddressUseCase } from "../../application/user-use.case/userAddress.use-case";

const userRepositoryImpl = new UserRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();

const userAddAddressUseCase = new UserAddAddressUseCase(userRepositoryImpl, addressRepositoryImpl);
const userFetchAddressUseCase = new UserFetchAddressUseCase(userRepositoryImpl, addressRepositoryImpl);

export class UserAddressController {
    constructor(
        private userFetchAddressUseCase: UserFetchAddressUseCase,
        private userAddAddressUseCase: UserAddAddressUseCase,
    ){
        this.getAddress = this.getAddress.bind(this);
        this.addAddress = this.addAddress.bind(this);
    }

    async getAddress(req: Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            if(!userId) throw new Error("Invalid request.");
            const result = await this.userFetchAddressUseCase.execute({userId : new Types.ObjectId(userId)});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async addAddress(req: Request, res: Response) {
        try{
            const validateData = AddAddressZodSchema.parse(req.body)
            const userId = req.user.userOrProviderId;
            const { addressLine, phone, place, city, district, pincode, state,  country, googleMapLink } = validateData;
            if(!userId || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");
            const result = await this.userAddAddressUseCase.execute({userId: new Types.ObjectId(userId), addressLine, phone, place, city, district, pincode, state,  country, googleMapLink});
            res.status(200).json(result);
            if(!userId) throw new Error("Invalid request.");
        }catch(error){
            HandleError.handle(error,res);
        }
    }
}

const userAddressController = new UserAddressController( userFetchAddressUseCase, userAddAddressUseCase );
export { userAddressController };