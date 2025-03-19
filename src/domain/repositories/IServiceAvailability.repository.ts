import { ServiceAvailability } from "../entities/serviceAvailability.entity";

export interface IServiceAvailabilityRepository {
    createServiceAvailability(serviceAvailability: ServiceAvailability): Promise<ServiceAvailability>;
}