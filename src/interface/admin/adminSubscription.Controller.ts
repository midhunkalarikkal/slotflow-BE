import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { SubscriptionRepositoryImpl } from "../../infrastructure/database/subscription/subscription.repository.impl";
import { AdminFetchAllSubscriptionsUseCase, AdminFetchSubscriptionDetailsUseCase } from "../../application/admin-use.case/adminSubscription.use-case";

const subscriptionRepositoryImpl = new SubscriptionRepositoryImpl();
const adminFetchAllSubscriptionsUseCase = new AdminFetchAllSubscriptionsUseCase(subscriptionRepositoryImpl);
const adminFetchSubscriptionDetailsUseCase = new AdminFetchSubscriptionDetailsUseCase(subscriptionRepositoryImpl);

export class AdminSubscriptionController {
    constructor(
        private adminFetchAllSubscriptionsUseCase: AdminFetchAllSubscriptionsUseCase,
        private adminFetchSubscriptionDetailsUseCase: AdminFetchSubscriptionDetailsUseCase,
    ) { 
        this.getAllSubscriptions = this.getAllSubscriptions.bind(this);
        this.getSubscriptionDetails = this.getSubscriptionDetails.bind(this);
    }

    async getAllSubscriptions(req:Request, res: Response) {
        try{
            const result = await this.adminFetchAllSubscriptionsUseCase.execute();
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error,res);
        }
    }

    async getSubscriptionDetails(req: Request, res: Response) {
        try{
            console.log("calling");
            const { subscriptionId } = req.params;
            if(!subscriptionId) throw new Error("Invalid request.");
            const result = await this.adminFetchSubscriptionDetailsUseCase.execute(subscriptionId);
            console.log("Result : ",result);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const adminSubscriptionController = new AdminSubscriptionController( adminFetchAllSubscriptionsUseCase, adminFetchSubscriptionDetailsUseCase );
export { adminSubscriptionController }