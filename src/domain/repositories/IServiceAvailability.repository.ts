import { Types } from "mongoose";
import { Availability, FontendAvailabilityForResponse, FrontendAvailabilityForRequest, ServiceAvailability } from "../entities/serviceAvailability.entity";

export interface IServiceAvailabilityRepository {
    
    createServiceAvailabilities(providerId: Types.ObjectId, serviceAvailability: Array<FrontendAvailabilityForRequest>): Promise<ServiceAvailability>;

    findServiceAvailabilityByProviderId(providerId: Types.ObjectId, date: Date): Promise<FontendAvailabilityForResponse | null>;

    updateServiceAvailability(providerId: Types.ObjectId, day: string, slotId: Types.ObjectId, options : { session?: any }): Promise<ServiceAvailability | null>;

    findServiceAvailabilityWithLiveData(providerId: Types.ObjectId, date: Date, day: string) : Promise<{} | null>;

}