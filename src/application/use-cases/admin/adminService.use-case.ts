import { Types } from "mongoose";
import { Service } from "../../../domain/entities/service.entity";
import { ServiceRepositoryImpl } from "../../../infrastructure/database/appservice/service.repository.impl";

export class AdminServiceListUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(): Promise<{ success: boolean, message: string, services?: Service[] }> {
        const services = await this.seriveRepository.findAllServices();
        if (!services) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", services };
    }
}

export class AdminAddServiceUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(serviceName: string): Promise<{ success: boolean, message: string, service: Service }> {
        if(!serviceName) throw new Error("Invalid request.");
        const exist = await this.seriveRepository.findByName(serviceName);
        if (exist) throw new Error("Service already exist.");
        const service = await this.seriveRepository.createService(serviceName);
        if (!service) throw new Error("Service adding error, please try again.");
        return { success: true, message: "Service added successfully.", service };
    }
}

export class AdminChnageServiceStatusUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async execute(serviceId: string, status: boolean): Promise<{ success: boolean, message: string, updatedService: Partial<Service> }> {
        if(!serviceId || status === null) throw new Error("Invalid request.");
        const updatedService = await this.seriveRepository.updateServiceStatus(new Types.ObjectId(serviceId), status);
        if (!updatedService) throw new Error("Service status changing error.");
        return { success: true, message: `Service ${status ? "Blocked" : "Unblocked"} successfully.`, updatedService }
    }
}