import { Service } from "../../../domain/entities/service.entity";
import { ServiceRepositoryImpl } from '../../../infrastructure/database/appservice/service.repository.impl';

export class ProviderFetchAllAppServicesUseCase {
    constructor(private serviceRepository: ServiceRepositoryImpl) { }

    async execute(): Promise<{ success: boolean; message: string; services?: Partial<Service>[] }> {
        const services = await this.serviceRepository.findAllServices();
        if (!services) throw new Error("No services found.");
        const filteredServices = services.map(service => ({
            serviceName: service.serviceName,
        }));
        return { success: true, message: "Services fetched successfully.", services: filteredServices };
    }
}