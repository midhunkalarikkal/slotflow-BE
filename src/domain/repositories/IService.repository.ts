import { Types } from "mongoose";
import { Service } from "../entities/service.entity";

export type ServicesProps = Pick<Service, "_id" | "serviceName" | "isBlocked">

export interface IServiceRepository {
    createService(service: String): Promise<ServicesProps | null>;

    findAllServices(): Promise<ServicesProps[] | null>;
    
    findByName(serviceName: string): Promise<ServicesProps | null>;

    updateServiceBlockStatus(serviceId: Types.ObjectId, status: boolean): Promise<ServicesProps | null>;
}