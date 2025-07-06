import { Types } from "mongoose";
import { Service } from "../entities/service.entity";
import { AdminServiceListResponse } from "../../infrastructure/dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse, FetchAllAppServicesResponse } from "../../infrastructure/dtos/common.dto";


export interface IServiceRepository {
    createService(service: String): Promise<Service | null>;

    findAllServices({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminServiceListResponse>>;
    
    findServiceByName(serviceName: string): Promise<Service | null>;

    findServiceById(serviceId: Types.ObjectId): Promise<Service | null>;

    updateService(serviceId: Types.ObjectId, service: Service): Promise<Service | null>;

    findAllServiceNames(): Promise<FetchAllAppServicesResponse>
}