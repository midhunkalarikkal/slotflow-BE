import { IService, ServiceModel } from "./service.model";
import { Service } from "../../../domain/entities/service.entity";
import { IServiceRepository } from "../../../domain/repositories/IService.repository";
import { Types } from "mongoose";

export class ServiceRepositoryImpl implements IServiceRepository {
    private mapToEntity(service: IService): Service {
        return new Service(
            service.serviceName,
            service.isBlocked,
            service._id,
        )
    }

    async createService(service: String): Promise<Service | null> {
        try {
            const createdService = await ServiceModel.create({
                serviceName: service
              });
            return createdService ? this.mapToEntity(createdService) : null;
        } catch (error) {
            throw new Error("Unable to create service, Please try again after a few minutes.");
        }
    }
    
    async findByName(serviceName: string): Promise<Boolean> {
        try{
            const existingService = await ServiceModel.findOne({ serviceName: serviceName });
            return !!existingService;
        }catch (error){
            throw new Error("Unexpected error, Please try again after a few minutes.");
        }
    }

    async findAllServices(): Promise<Service[] | null> {
        try {
            const services = await ServiceModel.find({}, { _id: 1, serviceName: 1, isBlocked: 1 });
            return services ? services.map((service) => this.mapToEntity(service)) : null;
        } catch (error) {
            throw new Error("Failed to fetch services from database.");
        }
    }

    async updateServiceStatus(serviceId: Types.ObjectId, status: boolean): Promise<Partial<Service> | null> {
        try{
            const updatedService = await ServiceModel.findByIdAndUpdate(
                serviceId,
                { isBlocked: status },
                { new: true, select: '_id isBlocked' }
            )
            return updatedService || null;
        }catch(error){
            throw new Error("Failed to update service status.");
        }
    }
}