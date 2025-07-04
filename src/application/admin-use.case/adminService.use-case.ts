import { 
    AdminAddServiceResponse, 
    AdminAddServiceRequest, 
    AdminChangeServiceStatusResponse, 
    AdminChnageServiceIsBlockedStatusRequest,
    AdminServiceListResponse, 
} from "../../infrastructure/dtos/admin.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";

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

    async execute(data: AdminAddServiceRequest): Promise<AdminAddServiceResponse> {
        const { serviceName } = data;
        if(!serviceName) throw new Error("Invalid request.");

        Validator.validateAppServiceName(serviceName);

        const existService = await this.seriveRepositoryImpl.findServiceByName(serviceName);
        if (existService) throw new Error("Service already exist.");
        const service = await this.seriveRepositoryImpl.createService(serviceName);
        if (!service) throw new Error("Service adding error, please try again.");
        const { createdAt, updatedAt, ...rest} = service
        return { success: true, message: "Service added successfully.", service: rest };
    }
}


export class AdminChnageServiceBlockStatusUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute(data: AdminChnageServiceIsBlockedStatusRequest): Promise<AdminChangeServiceStatusResponse> {
        const {serviceId, isBlocked} = data;
        console.log("isBlocked : ",isBlocked);
        if(!serviceId || isBlocked === null) throw new Error("Invalid request.");
        
        Validator.validateObjectId(serviceId, "serviceId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const existingService = await this.seriveRepositoryImpl.findServiceById(serviceId);
        if(!existingService) throw new Error("No service found.");
        existingService.isBlocked = isBlocked;
        const updatedService = await this.seriveRepositoryImpl.updateService(serviceId, existingService);
        if (!updatedService) throw new Error("Service status changing error.");
        const { createdAt, updatedAt, ...rest } = updatedService;
        return { success: true, message: `Service ${isBlocked ? "Blocked" : "Unblocked"} successfully.`, updatedService: rest }
    }
}