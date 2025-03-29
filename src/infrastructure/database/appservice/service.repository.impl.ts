import { Types } from "mongoose";
import { IService, ServiceModel } from "./service.model";
import { Service } from "../../../domain/entities/service.entity";
import { IServiceRepository, ServicesProps } from "../../../domain/repositories/IService.repository";

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

    async createService(service: String): Promise<Service | null> {
        try {
            const createdService = await ServiceModel.create({ serviceName: service });
            return createdService ? this.mapToEntity(createdService) : null;
        } catch (error) {
            throw new Error("Unable to create service, Please try again after a few minutes.");
        }
    }
    
    async findServiceByName(serviceName: string): Promise<Service | null> {
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

    async findServiceById(serviceId: Types.ObjectId): Promise<Service | null> {
        try{
            const service = await ServiceModel.findById(serviceId);
            return service ? this.mapToEntity(service) : null;
        }catch(error){
            throw new Error("Service finding by id error.");
        }
    }

    async updateService(serviceId: Types.ObjectId, service: Service): Promise<Service | null> {
        try{
            const updatedService = await ServiceModel.findOneAndUpdate(serviceId,service, { new: true });
            return updatedService ? this.mapToEntity(updatedService) : null;
        }catch(error){
            throw new Error("Service updating error.");
        }
    }
}