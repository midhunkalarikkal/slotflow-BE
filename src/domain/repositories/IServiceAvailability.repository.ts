import { Types } from "mongoose";
import { Availability, FontendAvailability, ServiceAvailability } from "../entities/serviceAvailability.entity";

export interface IServiceAvailabilityRepository {
    
    createServiceAvailabilities(providerId: Types.ObjectId, serviceAvailability: Array<Availability>): Promise<ServiceAvailability>;

    findServiceAvailabilityByProviderId(providerId: Types.ObjectId, date: Date): Promise<Array<FontendAvailability> | null>;

    updateServiceAvailability(providerId: Types.ObjectId, day: string, slotId: Types.ObjectId, options : { session?: any }): Promise<ServiceAvailability | null>;

    findServiceAvailabilityWithLiveData(providerId: Types.ObjectId, date: Date, day: string) : Promise<{} | null>;

}