import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AddAddressZodSchema } from "../../infrastructure/zod/common.zod";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderAddAddressUseCase, ProviderFetchAddressUseCase } from "../../application/provider-use.case/providerAddress.use-case";

const addressRepositoryImpl = new AddressRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();

const providerFetchAddressUseCase = new ProviderFetchAddressUseCase(addressRepositoryImpl);
const providerAddAddressUseCase = new ProviderAddAddressUseCase(providerRepositoryImpl, addressRepositoryImpl);

class ProviderAddressController {
    constructor(
        private providerAddAddressUseCase: ProviderAddAddressUseCase,
        private providerFetchAddressUseCase: ProviderFetchAddressUseCase,
    ) {
        this.addAddress = this.addAddress.bind(this);
        this.getAddress = this.getAddress.bind(this);
    }

    async addAddress(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const validateData = AddAddressZodSchema.parse(req.body);
            const { addressLine, phone, place, city, district, pincode, state,  country, googleMapLink } = validateData;
            const result = await this.providerAddAddressUseCase.execute({userId: new Types.ObjectId(providerId), addressLine, phone, place, city, district, pincode, state,  country, googleMapLink});
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async getAddress(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchAddressUseCase.execute({providerId: new Types.ObjectId(providerId)});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
  
}

const provideAddressController = new ProviderAddressController(
    providerAddAddressUseCase, 
    providerFetchAddressUseCase
);

export { provideAddressController };