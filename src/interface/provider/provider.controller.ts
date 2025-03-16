import { Request, Response } from "express";
import { ProviderUseCase } from "../../application/use-cases/provider/provider.use-case";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const providerUseCase = new ProviderUseCase(providerRepositoryImpl);

class ProviderController {
    constructor(private providerUseCase: ProviderUseCase) {
        this.checkApprovalStatus = this.checkApprovalStatus.bind(this);
    }

    async checkApprovalStatus(req: Request, res: Response) {
        try {
            const { providerId } = req.params;
            const result = await this.providerUseCase.execute(providerId);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const providerController = new ProviderController(providerUseCase);
export { providerController };