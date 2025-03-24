import { Types } from "mongoose";
import { IService, ServiceModel } from "./service.model";
import { Service } from "../../../domain/entities/service.entity";
import { ServicesProps, IServiceRepository, UpdateServiceBlockProps } from "../../../domain/repositories/IService.repository";

export class ServiceRepositoryImpl implements IServiceRepository {
    private mapToEntity(service: IService): Service {
        return new Service(
            service._id,
            service.serviceName,
            service.isBlocked,
            service.createdAt,
            service.updatedAt,
        )
    }

    async createService(service: String): Promise<ServicesProps | null> {
        try {
            const createdService = await ServiceModel.create({ serviceName: service });
            return createdService ? this.mapToEntity(createdService) : null;
        } catch (error) {
            throw new Error("Unable to create service, Please try again after a few minutes.");
        }
    }
    
    async findByName(serviceName: string): Promise<ServicesProps | null> {
        try{
            if(!serviceName) throw new Error("Invalid request.");
            const existingService = await ServiceModel.findOne({ serviceName: serviceName });
            return existingService ? this.mapToEntity(existingService) : null;
        }catch (error){
            throw new Error("Unexpected error, Please try again after a few minutes.");
        }
    }

    async findAllServices(): Promise<ServicesProps[] | null> {
        try {
            const services = await ServiceModel.find({}, { _id: 1, serviceName: 1, isBlocked: 1 });
            return services ? services.map((service) => this.mapToEntity(service)) : null;
        } catch (error) {
            throw new Error("Failed to fetch services from database.");
        }
    }

    async updateServiceBlockStatus(serviceId: Types.ObjectId, status: boolean): Promise<UpdateServiceBlockProps | null> {
        try{
            const updatedService = await ServiceModel.findByIdAndUpdate(serviceId, { isBlocked: status }, { new: true, select: '_id isBlocked' })
            return updatedService || null;
        }catch(error){
            throw new Error("Failed to update service status.");
        }
    }
}