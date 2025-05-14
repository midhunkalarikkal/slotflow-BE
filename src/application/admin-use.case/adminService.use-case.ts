import { Types } from "mongoose";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { AdminAddServiceRequestPayload, AdminAddServiceResProps, AdminChangeServiceStatusResProps, AdminChnageServiceIsBlockedStatusRequestPayload, AdminServiceListResProps } from "../../infrastructure/dtos/admin.dto";

export class AdminServiceListUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(): Promise<AdminServiceListResProps> {
        const services = await this.seriveRepository.findAllServices();
        if (!services) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", services };
    }
}

export class AdminAddServiceUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute({serviceName}: AdminAddServiceRequestPayload): Promise<AdminAddServiceResProps> {
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

    async execute({serviceId, isBlocked}: AdminChnageServiceIsBlockedStatusRequestPayload): Promise<AdminChangeServiceStatusResProps> {
        if(!serviceId || isBlocked === null) throw new Error("Invalid request.");
        const existingService = await this.seriveRepository.findServiceById(serviceId);
        if(!existingService) throw new Error("No service found.");
        existingService.isBlocked = isBlocked;
        const updatedService = await this.seriveRepository.updateService(serviceId, existingService);
        if (!updatedService) throw new Error("Service status changing error.");
        const { createdAt, updatedAt, ...data } = updatedService;
        return { success: true, message: `Service ${status ? "Blocked" : "Unblocked"} successfully.`, updatedService: data }
    }
}