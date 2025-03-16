import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderUseCase } from "../../application/use-cases/provider/provider.use-case";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const providerUseCase = new ProviderUseCase(providerRepositoryImpl, addressRepositoryImpl);

class ProviderController {
    constructor(private providerUseCase: ProviderUseCase) {
        this.addAddress = this.addAddress.bind(this);
    }

    async addAddress(req: Request, res: Response) {
        try {
            const { providerId } = req.params;
            const { addressLine, phone, place, city, district, pincode, state,  country, googleMapLink } = req.body;
            console.log("providerId : ",providerId);
            console.log("req.body : ",req.body);
            const result = await this.providerUseCase.execute(providerId, addressLine, phone, place, city, district, pincode, state,  country, googleMapLink);
            console.log("result : ",result);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const providerController = new ProviderController(providerUseCase);
export { providerController };