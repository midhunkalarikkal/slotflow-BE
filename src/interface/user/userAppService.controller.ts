import { Request, Response } from "express"
import { HandleError } from "../../infrastructure/error/error"
import { UserFetchAllAppServiceUseCase } from "../../application/user-use.case/userAppService.use-case";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";

const serviceRepositoryImpl = new ServiceRepositoryImpl();
const userFetchAllAppServiceUseCase = new UserFetchAllAppServiceUseCase(serviceRepositoryImpl);

export class UserAppServiceController {
    constructor(
        private userFetchAllAppServiceUseCase: UserFetchAllAppServiceUseCase
    ){ 
        this.fetchAllAppService = this.fetchAllAppService.bind(this);
    }
    async fetchAllAppService(req: Request, res:Response) {
        try{
            const result = await this.userFetchAllAppServiceUseCase.execute();
            res.status(200).json(result);
        } catch(error) {
            HandleError.handle(error,res);
        }
    }
}

const userAppServiceController = new UserAppServiceController( userFetchAllAppServiceUseCase )

export { userAppServiceController }