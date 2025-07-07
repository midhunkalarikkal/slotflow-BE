import { 
    AdminAddServiceRequest, 
    AdminServiceListResponse, 
    AdminChnageServiceIsBlockedStatusRequest,
} from "../../infrastructure/dtos/admin.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";


export class AdminServiceListUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminServiceListResponse>> {
        
        const result = await this.seriveRepositoryImpl.findAllServices({ page, limit });
        if (!result) throw new Error("Services fetching failed, ");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}


export class AdminAddServiceUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute({ serviceName } : AdminAddServiceRequest): Promise<ApiResponse> {

        if(!serviceName) throw new Error("Invalid request.");

        Validator.validateAppServiceName(serviceName);

        const existService = await this.seriveRepositoryImpl.findServiceByName(serviceName);
        if (existService) throw new Error("Service already exist.");
        const service = await this.seriveRepositoryImpl.createService(serviceName);
        if (!service) throw new Error("Service adding error, please try again.");
        return { success: true, message: "Service added successfully." };
    }
}


export class AdminChnageServiceBlockStatusUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute({serviceId, isBlocked}: AdminChnageServiceIsBlockedStatusRequest): Promise<ApiResponse> {

        if(!serviceId || isBlocked === null) throw new Error("Invalid request.");
        
        Validator.validateObjectId(serviceId, "serviceId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const existingService = await this.seriveRepositoryImpl.findServiceById(serviceId);
        if(!existingService) throw new Error("No service found.");
        existingService.isBlocked = isBlocked;
        const updatedService = await this.seriveRepositoryImpl.updateService(serviceId, existingService);
        if (!updatedService) throw new Error("Service status changing error.");
        return { success: true, message: `Service ${isBlocked ? "Blocked" : "Unblocked"} successfully.` }
    }
}