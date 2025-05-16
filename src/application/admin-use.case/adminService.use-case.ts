import { Validator } from "../../infrastructure/validator/validator";
import { ServiceRepositoryImpl } from "../../infrastructure/database/appservice/service.repository.impl";
import { 
    AdminAddServiceUseCaseResponse, 
    AdminServiceListUseCaseResponse, 
    AdminAddServiceUseCaseRequestPayload, 
    AdminChangeServiceStatusUseCaseResponse, 
    AdminChnageServiceIsBlockedStatusUseCaseRequestPayload, 
} from "../../infrastructure/dtos/admin.dto";

export class AdminServiceListUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute(): Promise<AdminServiceListUseCaseResponse> {
        const services = await this.seriveRepositoryImpl.findAllServices();
        if (!services) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", services };
    }
}


export class AdminAddServiceUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute(data: AdminAddServiceUseCaseRequestPayload): Promise<AdminAddServiceUseCaseResponse> {
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


export class AdminChnageServiceStatusUseCase {
    constructor(
        private seriveRepositoryImpl: ServiceRepositoryImpl
    ) { }

    async execute(data: AdminChnageServiceIsBlockedStatusUseCaseRequestPayload): Promise<AdminChangeServiceStatusUseCaseResponse> {
        const {serviceId, isBlocked} = data;
        if(!serviceId || isBlocked === null) throw new Error("Invalid request.");
        
        Validator.validateObjectId(serviceId, "serviceId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const existingService = await this.seriveRepositoryImpl.findServiceById(serviceId);
        if(!existingService) throw new Error("No service found.");
        existingService.isBlocked = isBlocked;
        const updatedService = await this.seriveRepositoryImpl.updateService(serviceId, existingService);
        if (!updatedService) throw new Error("Service status changing error.");
        const { createdAt, updatedAt, ...rest } = updatedService;
        return { success: true, message: `Service ${status ? "Blocked" : "Unblocked"} successfully.`, updatedService: rest }
    }
}