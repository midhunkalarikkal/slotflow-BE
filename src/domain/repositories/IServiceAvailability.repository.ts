import { Types } from "mongoose";
import { Availability, ServiceAvailability } from "../entities/serviceAvailability.entity";

export interface IServiceAvailabilityRepository {
    createServiceAvailability(providerId: Types.ObjectId, serviceAvailability: Array<Availability>): Promise<ServiceAvailability>;

    findServiceAvailabilityByProviderId(providerId: Types.ObjectId): Promise<ServiceAvailability | null>;

    updateServiceAvailability(providerId: Types.ObjectId, day: string, slotId: Types.ObjectId, options : { session?: any }): Promise<ServiceAvailability | null>;

    findServiceAvailabilityWithLiveData(providerId: Types.ObjectId, date: Date, day: string) : Promise<{} | null>;

}