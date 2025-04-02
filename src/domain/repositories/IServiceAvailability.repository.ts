import { Types } from "mongoose";
import { Availability, ServiceAvailability } from "../entities/serviceAvailability.entity";

export interface IServiceAvailabilityRepository {
    createServiceAvailability(providerId: Types.ObjectId, serviceAvailability: Array<Availability>): Promise<ServiceAvailability>;

    findServiceAvailabilityByProviderId(providerId: Types.ObjectId): Promise<ServiceAvailability | null>;

}