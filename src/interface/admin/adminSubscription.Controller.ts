import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminFetchAllSubscriptionsUseCase } from "../../application/use-cases/admin/adminSubscription.use-case";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";

const subscriptionRepositoryImpl = new SubscriptionRepositoryImpl();
const adminFetchAllSubscriptionsUseCase = new AdminFetchAllSubscriptionsUseCase(subscriptionRepositoryImpl);

export class AdminSubscriptionController {
    constructor(
        private adminFetchAllSubscriptionsUseCase: AdminFetchAllSubscriptionsUseCase,
    ) { 
        this.fetchAllSubscriptions = this.fetchAllSubscriptions.bind(this);
    }

    async fetchAllSubscriptions(req:Request, res: Response) {
        try{
            const result = await this.adminFetchAllSubscriptionsUseCase.execute();
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error,res);
        }
    }
}

const adminSubscriptionController = new AdminSubscriptionController( adminFetchAllSubscriptionsUseCase );
export { adminSubscriptionController }