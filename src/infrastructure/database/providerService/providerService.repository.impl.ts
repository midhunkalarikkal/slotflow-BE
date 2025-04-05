import { Types } from "mongoose";
import { IProviderService, ProviderServiceModel } from "./providerService.model";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { CreateProviderServiceReqProps, FindProviderServiceResProps, IProviderServiceRepository } from "../../../domain/repositories/IProviderService.repository";

export class ProviderServiceRepositoryImpl implements IProviderServiceRepository {
    private mapToEntity(providerService: IProviderService): ProviderService {
        return new ProviderService(
            providerService._id,
            providerService.providerId,
            providerService.serviceCategory,
            providerService.serviceName,
            providerService.serviceDescription,
            providerService.servicePrice,
            providerService.providerAdhaar,
            providerService.providerExperience,
            providerService.providerCertificateUrl,
            providerService.createdAt,
            providerService.updatedAt,
        );
    }

    async createProviderService(providerService: CreateProviderServiceReqProps): Promise<ProviderService | null> {
        try{
            if(!providerService) throw new Error("Invalid request.");
            const newProviderService = await ProviderServiceModel.create(providerService);
            return newProviderService ? this.mapToEntity(newProviderService) : null;
        }catch(error){
            throw new Error("Service details adding error.");
        }
    }

    async findProviderServiceByProviderId(providerId: Types.ObjectId): Promise<FindProviderServiceResProps | {}> {
        try{
            if(!providerId) throw new Error("Invalid request.");
            const service = await ProviderServiceModel.findOne({ providerId })
            .populate({
                path: "serviceCategory",
                select: "-_id serviceName"
            }).lean();
            return service || {};
        }catch(error){
            throw new Error("Service fetching error.");
        }
    }
    
}