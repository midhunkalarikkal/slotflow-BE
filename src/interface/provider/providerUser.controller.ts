import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderFetchUserForChatSidebarUseCase } from "../../application/provider-use.case/providerUser.use-case";
import { Types } from "mongoose";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";

const  bookingRepositoryImpl = new BookingRepositoryImpl();
const providerFetchUserForChatSidebarUseCase = new ProviderFetchUserForChatSidebarUseCase( bookingRepositoryImpl );

export class ProviderUserController {
    constructor(
        private providerFetchUserForChatSidebarUseCase: ProviderFetchUserForChatSidebarUseCase,
    ) {
        this.fetchUsersForChatSideBar = this.fetchUsersForChatSideBar.bind(this);
    }

    async fetchUsersForChatSideBar(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const result = await this.providerFetchUserForChatSidebarUseCase.execute(new Types.ObjectId(providerId));
            console.log("result : ",result);
            res.status(200).json(result);
        }catch(error) {
            HandleError.handle(error,res);
        }
    }
}

const providerUserController = new ProviderUserController( providerFetchUserForChatSidebarUseCase );
export { providerUserController };