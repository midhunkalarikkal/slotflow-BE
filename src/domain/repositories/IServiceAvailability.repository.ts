import { Types } from "mongoose";
import { FontendAvailabilityForResponse, FrontendAvailabilityUpdatedSlots, ServiceAvailability } from "../entities/serviceAvailability.entity";

export interface IServiceAvailabilityRepository {
    
    createServiceAvailabilities(providerId: Types.ObjectId, serviceAvailability: Array<FrontendAvailabilityUpdatedSlots>): Promise<ServiceAvailability>;

    findServiceAvailabilityByProviderId(providerId: Types.ObjectId, date: Date): Promise<FontendAvailabilityForResponse | null>;

    updateServiceAvailability(providerId: Types.ObjectId, day: string, slotId: Types.ObjectId, options : { session?: any }): Promise<ServiceAvailability | null>;

    findServiceAvailabilityWithLiveData(providerId: Types.ObjectId, date: Date, day: string) : Promise<{} | null>;

}