import { Types } from "mongoose";
import { IService, ServiceModel } from "./service.model";
import { Service } from "../../../domain/entities/service.entity";
import { IServiceRepository } from "../../../domain/repositories/IService.repository";
import { ApiPaginationRequest, ApiResponse, FetchAllAppServicesResponse } from "../../dtos/common.dto";
import { AdminServiceListResponse } from "../../dtos/admin.dto";

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
        try {
            const existingService = await ServiceModel.findOne({ serviceName: serviceName });
            return existingService ? this.mapToEntity(existingService) : null;
        } catch (error) {
            throw new Error("Unexpected error, Please try again after a few minutes.");
        }
    }

    async findAllServices({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminServiceListResponse>> {
        try {
            const skip = (page - 1) * limit;
            const [services, totalCount] = await Promise.all([
                ServiceModel.find({}, {
                    _id: 1,
                    serviceName: 1,
                    isBlocked: 1,
                }).skip(skip).limit(limit).lean(),
                ServiceModel.countDocuments(),
            ])
            const totalPages = Math.ceil(totalCount / limit);
            return {
                data: services.map(this.mapToEntity),
                totalPages,
                currentPage: page,
                totalCount
            }
        } catch (error) {
            throw new Error("Failed to fetch services from database.");
        }
    }

    async findServiceById(serviceId: Types.ObjectId): Promise<Service | null> {
        try {
            const service = await ServiceModel.findById(serviceId);
            return service ? this.mapToEntity(service) : null;
        } catch (error) {
            throw new Error("Service finding by id failed.");
        }
    }

    async updateService(serviceId: Types.ObjectId, service: Service): Promise<Service | null> {
        try {
            const updatedService = await ServiceModel.findOneAndUpdate(serviceId, service, { new: true });
            return updatedService ? this.mapToEntity(updatedService) : null;
        } catch (error) {
            throw new Error("Service updating failed.");
        }
    }

    async findAllServiceNames(): Promise<FetchAllAppServicesResponse> {
        try {
            const services = await ServiceModel.find({}, {
                    _id: 1,
                    serviceName: 1,
                });
            return services.map(this.mapToEntity);
        }catch (error) {
            throw new Error("Services fetching failed")
        }
    }
}