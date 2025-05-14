import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { UserFetchServiceProviderAddressUseCase, UserFetchServiceProviderProfileDetailsUseCase, UserFetchServiceProviderServiceAvailabilityUseCase, UserFetchServiceProviderServiceDetailsUseCase, UserFetchServiceProvidersUseCase } from "../../application/user-use.case/userProvider.use-case";

const userRepositoryImpl = new UserRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const providerServiceRepository = new ProviderServiceRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();
const userFetchServiceProvidersUseCase = new UserFetchServiceProvidersUseCase( userRepositoryImpl, providerServiceRepositoryImpl );
const userFetchServiceProviderProfileDetailsUseCase = new UserFetchServiceProviderProfileDetailsUseCase( userRepositoryImpl, providerRepositoryImpl );
const userFetchServiceProviderAddressUseCase = new UserFetchServiceProviderAddressUseCase( userRepositoryImpl, addressRepositoryImpl );
const userFetchServiceProviderServiceDetailsUseCase = new UserFetchServiceProviderServiceDetailsUseCase( userRepositoryImpl, providerServiceRepository );
const userFetchServiceProviderServiceAvailabilityUseCase = new UserFetchServiceProviderServiceAvailabilityUseCase( userRepositoryImpl, serviceAvailabilityRepositoryImpl );

export class UserProviderController {
    constructor(
        private userFetchServiceProvidersUseCase: UserFetchServiceProvidersUseCase,
        private userFetchServiceProviderProfileDetailsUseCase: UserFetchServiceProviderProfileDetailsUseCase,
        private userFetchServiceProviderAddressUseCase: UserFetchServiceProviderAddressUseCase,
        private userFetchServiceProviderServiceDetailsUseCase: UserFetchServiceProviderServiceDetailsUseCase,
        private userFetchServiceProviderServiceAvailabilityUseCase: UserFetchServiceProviderServiceAvailabilityUseCase,
    ){
        this.fetchServiceProviders = this.fetchServiceProviders.bind(this);
        this.fetchServiceProviderProfileDetails = this.fetchServiceProviderProfileDetails.bind(this);
        this.fetchServiceProviderAddress = this.fetchServiceProviderAddress.bind(this);
        this.fetchServiceProviderServiceDetails = this.fetchServiceProviderServiceDetails.bind(this);
        this.fetchServiceProviderServiceAvailability = this.fetchServiceProviderServiceAvailability.bind(this);
    }
    
    async fetchServiceProviders(req: Request, res: Response) {
        try{
            const userId = req.user.userOrProviderId;
            const selectedServices = req.params.selectedServices;
            if(!userId || !selectedServices) throw new Error("Invalid request.");
            const serviceIds = selectedServices.split(",");
            const result = await this.userFetchServiceProvidersUseCase.execute( userId, serviceIds );
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error,res);
        }
    }

    async fetchServiceProviderProfileDetails(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId } = req.params;
            if(!userId || !providerId) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderProfileDetailsUseCase.execute(userId, providerId);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderAddress(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId } = req.params;
            if(!userId || !providerId) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderAddressUseCase.execute(userId, providerId);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderServiceDetails(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId } = req.params;
            if(!userId || !providerId) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderServiceDetailsUseCase.execute(userId, providerId);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchServiceProviderServiceAvailability(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId } = req.params;
            const date = new Date(req.query.date as string);
            if(!userId || !providerId || !date) throw new Error("Invalid request");
            const result = await this.userFetchServiceProviderServiceAvailabilityUseCase.execute(userId, providerId, date);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const userProviderController = new UserProviderController( userFetchServiceProvidersUseCase, userFetchServiceProviderProfileDetailsUseCase, userFetchServiceProviderAddressUseCase, userFetchServiceProviderServiceDetailsUseCase, userFetchServiceProviderServiceAvailabilityUseCase );
export { userProviderController };