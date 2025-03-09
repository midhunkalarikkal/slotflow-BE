import { IService, ServiceModel } from "./service.model";
import { Service } from "../../../domain/entities/service.entity";
import { IServiceRepository } from "../../../domain/repositories/IService.repository";

export class ServiceRepositoryImpl implements IServiceRepository {
    private mapToEntity(service: IService): Service {
        return new Service(
            service.serviceName,
            service.isBlocked,
            service._id,
        )
    }

    async createService(service: String): Promise<Service> {
        try {
            const createdService = await ServiceModel.create({
                serviceName: service
              });
            return this.mapToEntity(createdService);
        } catch (error) {
            throw new Error("Unable to register, Please try again after a few minutes.");
        }
    }

    async findAllServices(): Promise<Service[]> {
        try {
            return await ServiceModel.find({}, { _id: 1, serviceName: 1, isBlocked: 1 });
        } catch (error) {
            throw new Error("Failed to fetch services from database.");
        }
    }

    async updateServiceStatus(serviceId: string, status: boolean): Promise<Partial<Service> | null> {
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