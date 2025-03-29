import { Types } from "mongoose";
import { Service } from "../../../domain/entities/service.entity";
import { ServiceRepositoryImpl } from "../../../infrastructure/database/appservice/service.repository.impl";

type ServicesProps = Pick<Service, "_id" | "serviceName" | "isBlocked">

export class AdminServiceListUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(): Promise<{ success: boolean, message: string, services: ServicesProps[] }> {
        const services = await this.seriveRepository.findAllServices();
        if (!services) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", services };
    }
}

export class AdminAddServiceUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(serviceName: string): Promise<{ success: boolean, message: string, service: ServicesProps }> {
        if(!serviceName) throw new Error("Invalid request.");
        const existService = await this.seriveRepository.findServiceByName(serviceName);
        if (existService) throw new Error("Service already exist.");
        const service = await this.seriveRepository.createService(serviceName);
        if (!service) throw new Error("Service adding error, please try again.");
        const { createdAt, updatedAt, ...data} = service
        return { success: true, message: "Service added successfully.", service: data };
    }
}

export class AdminChnageServiceStatusUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(serviceId: string, status: boolean): Promise<{ success: boolean, message: string, updatedService: ServicesProps }> {
        if(!serviceId || status === null) throw new Error("Invalid request.");
        const existingService = await this.seriveRepository.findServiceById(new Types.ObjectId(serviceId));
        if(!existingService) throw new Error("No service found.");
        existingService.isBlocked = status;
        const updatedService = await this.seriveRepository.updateService(new Types.ObjectId(serviceId), existingService);
        if (!updatedService) throw new Error("Service status changing error.");
        const { createdAt, updatedAt, ...data } = updatedService;
        return { success: true, message: `Service ${status ? "Blocked" : "Unblocked"} successfully.`, updatedService: data }
    }
}