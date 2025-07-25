import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { DateZodSchema } from "../../infrastructure/zod/common.zod";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { UserProviderControllerCommonZodSchema, UserFetchAllProvidersZodSchema } from "../../infrastructure/zod/user.zod";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { 
    UserFetchServiceProvidersUseCase, 
    UserFetchServiceProviderAddressUseCase, 
    UserFetchServiceProviderServiceDetailsUseCase, 
    UserFetchServiceProviderProfileDetailsUseCase, 
    UserFetchServiceProviderServiceAvailabilityUseCase,
    UserFetchProvidersForChatSidebar, 
} from "../../application/user-use.case/userProvider.use-case";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const bookingRepositoryImpl = new BookingRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const providerServiceRepository = new ProviderServiceRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();

const userFetchProvidersForChatSidebar = new UserFetchProvidersForChatSidebar(bookingRepositoryImpl);
const userFetchServiceProvidersUseCase = new UserFetchServiceProvidersUseCase(userRepositoryImpl, providerServiceRepositoryImpl);
const userFetchServiceProviderAddressUseCase = new UserFetchServiceProviderAddressUseCase(userRepositoryImpl, addressRepositoryImpl);
const userFetchServiceProviderProfileDetailsUseCase = new UserFetchServiceProviderProfileDetailsUseCase(userRepositoryImpl, providerRepositoryImpl);
const userFetchServiceProviderServiceDetailsUseCase = new UserFetchServiceProviderServiceDetailsUseCase(userRepositoryImpl, providerServiceRepository);
const userFetchServiceProviderServiceAvailabilityUseCase = new UserFetchServiceProviderServiceAvailabilityUseCase(userRepositoryImpl, serviceAvailabilityRepositoryImpl);

export class UserProviderController {
    constructor(
        private userFetchServiceProvidersUseCase: UserFetchServiceProvidersUseCase,
        private userFetchServiceProviderAddressUseCase: UserFetchServiceProviderAddressUseCase,
        private userFetchServiceProviderProfileDetailsUseCase: UserFetchServiceProviderProfileDetailsUseCase,
        private userFetchServiceProviderServiceDetailsUseCase: UserFetchServiceProviderServiceDetailsUseCase,
        private userFetchServiceProviderServiceAvailabilityUseCase: UserFetchServiceProviderServiceAvailabilityUseCase,
        private userFetchProvidersForChatSidebar: UserFetchProvidersForChatSidebar,
    ) {
        this.fetchServiceProviders = this.fetchServiceProviders.bind(this);
        this.fetchServiceProviderAddress = this.fetchServiceProviderAddress.bind(this);
        this.fetchServiceProviderProfileDetails = this.fetchServiceProviderProfileDetails.bind(this);
        this.fetchServiceProviderServiceDetails = this.fetchServiceProviderServiceDetails.bind(this);
        this.fetchServiceProviderServiceAvailability = this.fetchServiceProviderServiceAvailability.bind(this);
        this.fetchProvidersForChatSidebar = this.fetchProvidersForChatSidebar.bind(this);
    }

    async fetchServiceProviders(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateParams = UserFetchAllProvidersZodSchema.parse(req.params);
            const { selectedServices } = validateParams;
            if (!userId) throw new Error("Invalid request.");
            let serviceIds: Types.ObjectId[] = [];
            if (selectedServices) {
                serviceIds = selectedServices.split(",").map(id => new Types.ObjectId(id));
            }
            const result = await this.userFetchServiceProvidersUseCase.execute({ userId: new Types.ObjectId(userId), serviceIds });
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderAddress(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateParams = UserProviderControllerCommonZodSchema.parse(req.params);
            const { providerId } = validateParams;
            if (!userId || !providerId) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderAddressUseCase.execute({userId: new Types.ObjectId(userId), providerId: new Types.ObjectId(providerId)});
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderProfileDetails(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateParams = UserProviderControllerCommonZodSchema.parse(req.params);
            const { providerId } = validateParams;
            if (!userId || !providerId) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderProfileDetailsUseCase.execute({userId: new Types.ObjectId(userId), providerId: new Types.ObjectId(providerId)});
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderServiceDetails(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateParams = UserProviderControllerCommonZodSchema.parse(req.params)
            const { providerId } = validateParams;
            if (!userId || !providerId) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderServiceDetailsUseCase.execute({userId: new Types.ObjectId(userId), providerId: new Types.ObjectId(providerId)});
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderServiceAvailability(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const validateParams = UserProviderControllerCommonZodSchema.parse(req.params);
            const validateQuery = DateZodSchema.parse(req.query);
            const { providerId } = validateParams;
            const { date } = validateQuery;
            if (!userId || !providerId || !date) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderServiceAvailabilityUseCase.execute({userId: new Types.ObjectId(userId), providerId: new Types.ObjectId(providerId), date: new Date(date)});
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchProvidersForChatSidebar(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const result = await this.userFetchProvidersForChatSidebar.execute(new Types.ObjectId(userId));
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error,res);
        }
    }
}

const userProviderController = new UserProviderController(
    userFetchServiceProvidersUseCase, 
    userFetchServiceProviderAddressUseCase, 
    userFetchServiceProviderProfileDetailsUseCase, 
    userFetchServiceProviderServiceDetailsUseCase, 
    userFetchServiceProviderServiceAvailabilityUseCase,
    userFetchProvidersForChatSidebar
);
    
export { userProviderController };