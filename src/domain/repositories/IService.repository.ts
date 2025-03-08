import { Service } from "../entities/service.entity";

export interface IServiceRepository {
    createService(service: Service): Promise<Service>;
    findAllServices(): Promise<Service[]>;
}