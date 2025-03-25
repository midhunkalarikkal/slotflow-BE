import { s3Client } from "../../config/aws_s3";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { ProviderAddAddressUseCase } from "../../application/use-cases/provider/providerAddAddress.use-case";
import { ProviderAddServiceDetailsUseCase } from "../../application/use-cases/provider/providerAddServiceDetails.use-case";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ProviderFetchAllAppServicesUseCase } from "../../application/use-cases/provider/providerFetchAllAppServices.use-case";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ProviderAddServiceAvailabilityUseCase } from "../../application/use-cases/provider/providerAddServiceAvailabilityDetails.use-case";
import { ProviderFetchAddressUseCase, ProviderFetchProfileDetailsUseCase } from "../../application/use-cases/provider/providerProfile.use-case";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const serviceRepositoryImpl = new ServiceRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();

const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const providerAddAddressUseCase = new ProviderAddAddressUseCase(providerRepositoryImpl, addressRepositoryImpl);
const providerFetchAllServicesUseCase = new ProviderFetchAllAppServicesUseCase(serviceRepositoryImpl);
const providerAddServiceDetailsUseCase = new ProviderAddServiceDetailsUseCase(providerRepositoryImpl, providerServiceRepositoryImpl, s3Client);
const providerAddServiceAvailabilityUseCase = new ProviderAddServiceAvailabilityUseCase(providerRepositoryImpl, serviceAvailabilityRepositoryImpl);
const providerFetchProfileDetailsUseCase = new ProviderFetchProfileDetailsUseCase(providerRepositoryImpl);
const providerFetchAddressUseCase = new ProviderFetchAddressUseCase(addressRepositoryImpl);

class ProviderController {
    constructor(
        private providerAddAddressUseCase: ProviderAddAddressUseCase,
        private providerFetchAllServicesUseCase: ProviderFetchAllAppServicesUseCase,
        private providerAddServiceDetailsUseCase: ProviderAddServiceDetailsUseCase,
        private providerAddServiceAvailabilityUseCase: ProviderAddServiceAvailabilityUseCase,
        private providerFetchProfileDetailsUseCase: ProviderFetchProfileDetailsUseCase,
        private providerFetchAddressUseCase: ProviderFetchAddressUseCase,
    ) {
        this.addAddress = this.addAddress.bind(this);
        this.getAllServices = this.getAllServices.bind(this);
        this.addServiceDetails = this.addServiceDetails.bind(this);
        this.addServiceAvailability = this.addServiceAvailability.bind(this);
        this.getProfileDetails = this.getProfileDetails.bind(this);
        this.getAddress = this.getAddress.bind(this);
    }

    async addAddress(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            const { addressLine, phone, place, city, district, pincode, state,  country, googleMapLink } = req.body;
            if(!providerId || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");
            const result = await this.providerAddAddressUseCase.execute(providerId, addressLine, phone, place, city, district, pincode, state,  country, googleMapLink);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async getAllServices(req: Request, res: Response) {
        try{
            const result = await this.providerFetchAllServicesUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async addServiceDetails(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const { serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience } = req.body;
            const file = req.file;
            if(!providerId || !serviceCategory || !serviceName || !serviceDescription || !servicePrice || !providerAdhaar || !providerExperience || !file) throw new Error("Invalid Request.");
            const result = await this.providerAddServiceDetailsUseCase.execute(providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, file);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async addServiceAvailability(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            const availability = req.body;
            if(!providerId || !availability || availability.length  === 0) throw new Error("Invalid request.");
            const result = await this.providerAddServiceAvailabilityUseCase.execute(providerId, availability);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async getProfileDetails(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchProfileDetailsUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async getAddress(req: Request, res: Response) {
        try{
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request.");
            const result = await this.providerFetchAddressUseCase.execute(providerId);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }
}

const providerController = new ProviderController(providerAddAddressUseCase, providerFetchAllServicesUseCase, providerAddServiceDetailsUseCase, providerAddServiceAvailabilityUseCase, providerFetchProfileDetailsUseCase, providerFetchAddressUseCase);
export { providerController };