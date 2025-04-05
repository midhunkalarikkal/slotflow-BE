import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { UserFetchServiceProviderUseCase } from "../../application/use-cases/user/userProvider.use-case";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const userFetchServiceProviderUseCase = new UserFetchServiceProviderUseCase( userRepositoryImpl, providerServiceRepositoryImpl );

export class UserProviderController {
    constructor(
        private userFetchServiceProviderUseCase: UserFetchServiceProviderUseCase,
    ){
        this.fetchServiceProviders = this.fetchServiceProviders.bind(this);
    }
    
    async fetchServiceProviders(req: Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            const selectedServices = req.params.selectedServices;
            console.log("req.params.selectedServices : ",req.params.selectedServices);
            if(!userId || !selectedServices) throw new Error("Invalid request.");
            const serviceIds = selectedServices.split(",");
            const result = await this.userFetchServiceProviderUseCase.execute( userId, serviceIds );
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error,res);
        }
    }
}

const userProviderController = new UserProviderController( userFetchServiceProviderUseCase );
export { userProviderController };