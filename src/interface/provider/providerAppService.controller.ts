import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { ProviderFetchAllAppServicesUseCase } from "../../application/provider-use.case/providerAppServices.use-case";

const serviceRepositoryImpl = new ServiceRepositoryImpl();
const providerFetchAllServicesUseCase = new ProviderFetchAllAppServicesUseCase(serviceRepositoryImpl);

class ProviderAppServiceController {
    constructor(
        private providerFetchAllServicesUseCase: ProviderFetchAllAppServicesUseCase,
    ) {
        this.getAllAppServices = this.getAllAppServices.bind(this);
    }

    async getAllAppServices(req: Request, res: Response) {
        try{
            const result = await this.providerFetchAllServicesUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

}

const providerAppServiceController = new ProviderAppServiceController( providerFetchAllServicesUseCase );
export { providerAppServiceController };