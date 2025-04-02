import { Types } from "mongoose";
import { Service } from "../entities/service.entity";

export type ServicesProps = Pick<Service, "_id" | "serviceName" | "isBlocked">

export interface IServiceRepository {
    createService(service: String): Promise<Service | null>;

    findAllServices(): Promise<Array<ServicesProps> | null>;
    
    findServiceByName(serviceName: string): Promise<Service | null>;

    findServiceById(serviceId: Types.ObjectId): Promise<Service | null>;

    updateService(serviceId: Types.ObjectId, service: Service): Promise<Service | null>;
}