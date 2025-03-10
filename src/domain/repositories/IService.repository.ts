import { Service } from "../entities/service.entity";

export interface IServiceRepository {
    createService(service: String): Promise<Service>;
    findAllServices(): Promise<Service[]>;
    findByName(serviceName: string): Promise<Boolean>;
}