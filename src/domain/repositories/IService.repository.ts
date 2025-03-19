import { Types } from "mongoose";
import { Service } from "../entities/service.entity";

export interface IServiceRepository {
    createService(service: String): Promise<Service | null>;
    findAllServices(): Promise<Service[] | null>;
    findByName(serviceName: string): Promise<Boolean>;
    updateServiceStatus(serviceId: Types.ObjectId, status: boolean): Promise<Partial<Service> | null>;
}