import { s3Client } from "../../config/aws_s3";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { ProviderAddAddressUseCase } from "../../application/use-cases/provider/providerAddAddress.use-case";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { ProviderFetchAllAppServicesUseCase } from "../../application/use-cases/provider/providerFetchAlApplServices.use-case";
import { ProviderAddServiceDetailsUseCase } from "../../application/use-cases/provider/providerAddServiceDetails.use-case";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";

const providerRepositoryImpl = new ProviderRepositoryImpl();
const addressRepositoryImpl = new AddressRepositoryImpl();
const serviceRepositoryImpl = new ServiceRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const providerAddAddressUseCase = new ProviderAddAddressUseCase(providerRepositoryImpl, addressRepositoryImpl);
const providerFetchAllServicesUseCase = new ProviderFetchAllAppServicesUseCase(serviceRepositoryImpl);
const providerAddServiceDetailsUseCase = new ProviderAddServiceDetailsUseCase(providerServiceRepositoryImpl, s3Client);

class ProviderController {
    constructor(
        private providerAddAddressUseCase: ProviderAddAddressUseCase,
        private providerFetchAllServicesUseCase: ProviderFetchAllAppServicesUseCase,
        private providerAddServiceDetailsUseCase: ProviderAddServiceDetailsUseCase,
    ) {
        this.addAddress = this.addAddress.bind(this);
        this.fetchAllServices = this.fetchAllServices.bind(this);
        this.addServiceDetails = this.addServiceDetails.bind(this);
        this.addProviderServiceAvailability = this.addProviderServiceAvailability.bind(this);
    }

    async addAddress(req: Request, res: Response) {
        try {
            const { providerId } = req.params;
            const { addressLine, phone, place, city, district, pincode, state,  country, googleMapLink } = req.body;
            if(!providerId || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");
            const result = await this.providerAddAddressUseCase.execute(providerId, addressLine, phone, place, city, district, pincode, state,  country, googleMapLink);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async fetchAllServices(req: Request, res: Response) {
        try{
            const result = await this.providerFetchAllServicesUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async addServiceDetails(req: Request, res: Response) {
        try{
            const { providerId } = req.params;
            const { serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience } = req.body;
            const file = req.file;
            console.log("providerId : ",providerId);
            console.log("req.body : ",req.body);
            console.log("req.file : ",req.file);
            if(!providerId || !serviceCategory || !serviceName || !serviceDescription || !servicePrice || !providerAdhaar || !providerExperience || !file) throw new Error("Invalid Request.");
            const result = await this.providerAddServiceDetailsUseCase.execute(providerId, serviceCategory, serviceName, serviceDescription, servicePrice, providerAdhaar, providerExperience, file);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error,res);
        }
    }

    async addProviderServiceAvailability(req: Request, res: Response) {
        try{
            const  providerId = req?.user?.userOrProviderId;
            const availability = req.body;
            if(!providerId || !availability || availability.length  === 0) throw new Error("Invalid request.");
            console.log("providerId : ", providerId);
            console.log("req.body : ",req.body);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const providerController = new ProviderController(providerAddAddressUseCase, providerFetchAllServicesUseCase, providerAddServiceDetailsUseCase);
export { providerController };