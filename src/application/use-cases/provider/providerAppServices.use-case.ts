import { Service } from "../../../domain/entities/service.entity";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { ServiceRepositoryImpl } from '../../../infrastructure/database/appservice/service.repository.impl';


interface ProviderFetchAllAppServicesResProps extends CommonResponse {
    services: Array<Pick<Service, "serviceName">> | [];
}


export class ProviderFetchAllAppServicesUseCase {
    constructor(private serviceRepository: ServiceRepositoryImpl) { }

    async execute(): Promise<ProviderFetchAllAppServicesResProps> {
        const services = await this.serviceRepository.findAllServices();
        if(services === null) return { success: true, message: "No servicec found.", services: [] };
        if (!services) throw new Error("No services found.");
        const filteredServices = services.map(service => ({
            serviceName: service.serviceName,
        }));
        return { success: true, message: "Services fetched successfully.", services: filteredServices };
    }
}