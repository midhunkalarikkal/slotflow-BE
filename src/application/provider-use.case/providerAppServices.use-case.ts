import { ProviderFetchAllAppServicesResProps } from '../../infrastructure/dtos/provider.dto';
import { ServiceRepositoryImpl } from '../../infrastructure/database/appservice/service.repository.impl';


export class ProviderFetchAllAppServicesUseCase {
    constructor(private serviceRepository: ServiceRepositoryImpl) { }

    async execute(): Promise<ProviderFetchAllAppServicesResProps> {
        const services = await this.serviceRepository.findAllServices();
        if(services === null) return { success: true, message: "No servicec found.", services: [] };
        if (!services) throw new Error("No services found.");
        const filteredServices = services.map(service => ({
            _id: service._id,
            serviceName: service.serviceName,
        }));
        return { success: true, message: "Services fetched successfully.", services: filteredServices };
    }
}