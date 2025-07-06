import { ApiResponse, FetchAllAppServicesResponse } from "../../infrastructure/dtos/common.dto";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";

export class UserFetchAllAppServiceUseCase {

    constructor(private serviceRepositoryImpl: ServiceRepositoryImpl) { }

    async execute(): Promise<ApiResponse<FetchAllAppServicesResponse>> {
        const services = await this.serviceRepositoryImpl.findAllServiceNames();
        if (services === null) return { success: true, message: "No servicec found.", data: [] };
        if (!services) throw new Error("No services found.");
        const filteredServices = services.map(service => ({
            _id: service._id,
            serviceName: service.serviceName,
        }));
        return { success: true, message: "Services fetched successfully.", data: filteredServices };
    }

}