import { Service } from "../../../domain/entities/service.entity";
import { ServiceRepositoryImpl } from "../../../infrastructure/database/appservice/service.repository.impl";

export class AdminServiceUseCase {
    constructor(private seriveRepository: ServiceRepositoryImpl) { }

    async serviceList(): Promise<{ success: boolean, message: string, services?: Service[] }> {
        const services = await this.seriveRepository.findAllServices();
        if (!services) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", services };
    }

    async addService(serviceName: string): Promise<{ success: boolean, message: string, service: Service }> {
        const exist = await this.seriveRepository.findByName(serviceName);
        if (exist) throw new Error("Service already exist.");
        const service = await this.seriveRepository.createService(serviceName);
        if (!service) throw new Error("Service adding error, please try again.");
        return { success: true, message: "Service added successfully.", service };
    }

    async changeStatus(serviceId: string, status: boolean): Promise<{ success: boolean, message: string, updatedService: Partial<Service> }> {
        const updatedService = await this.seriveRepository.updateServiceStatus(serviceId, status);
        if (!updatedService) throw new Error("Service status changing error.");
        return { success: true, message: `Service ${status ? "Blocked" : "Unblocked"} successfully.`, updatedService }
    }
}