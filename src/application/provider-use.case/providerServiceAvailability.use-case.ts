import { Types } from "mongoose";
import { Validator } from "../../infrastructure/validator/validator";
import { CommonResponse } from "../../infrastructure/dtos/common.dto";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { FrontendAvailabilityForRequest, TimeSlot } from "../../domain/entities/serviceAvailability.entity";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { 
    ProviderFetchServiceAvailabilityUseCaseResponse, 
    ProviderAddServiceAvailabilityUseCaseRewuestPayload, 
    ProviderFetchServiceAvailabilityUseCaseRequestPayload, 
} from "../../infrastructure/dtos/provider.dto";
import dayjs from "dayjs";

export class ProviderAddServiceAvailabilitiesUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private serviceAvailabilityRepositoryImpl: ServiceAvailabilityRepositoryImpl,
    ){}

    async execute(data: ProviderAddServiceAvailabilityUseCaseRewuestPayload): Promise<CommonResponse> {
        const { providerId, availabilities } = data;
        if(!providerId || !availabilities || availabilities.length  === 0) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const convertedProviderId = new Types.ObjectId(providerId);
        const provider = await this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("Please logout and try again.");

        availabilities.map((data) => {
            Validator.validateDay(data.day);
            Validator.validateDuration(data.duration);
            Validator.validateStartTime(data.startTime);
            Validator.validateEndTime(data.endTime, data.startTime);
            Validator.validateModes(data.modes);
        })

        const newAvailabilities: FrontendAvailabilityForRequest[] = availabilities.map((availability: FrontendAvailabilityForRequest) => ({
            ...availability,
            slots: availability.slots.map((slot: TimeSlot) => ({
                time: slot.time, 
            }))
        }));
        
        const serviceAvailability = await this.serviceAvailabilityRepositoryImpl.createServiceAvailabilities(convertedProviderId, newAvailabilities)
        if(!serviceAvailability) throw new Error("Service availability adding failed.");
        
        if (provider && serviceAvailability && serviceAvailability._id) {
            provider.serviceAvailabilityId = serviceAvailability._id;
            const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with service availability ID.");
        }

        return { success: true, message: "Service availability added successfuly." };
    }
}


export class ProviderFetchServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepositoryImpl: ServiceAvailabilityRepositoryImpl) { }

    async execute(data: ProviderFetchServiceAvailabilityUseCaseRequestPayload): Promise<ProviderFetchServiceAvailabilityUseCaseResponse> {
        const { providerId, date } = data;
        if (!providerId || !date) throw new Error("Invalid request.");
        const currentDateTime = dayjs();
        const selectedDate = dayjs(date).format('YYYY-MM-DD');

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateDate(date);

        const availability = await this.serviceAvailabilityRepositoryImpl.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId), new Date(date));
        if(availability === null) return { success: true, message: "Provider service availability not yet added.", availability: {} };
        if (!availability) throw new Error("Provider service availability fetching error.");

        const updatedSlots = availability.slots.map((slot) => {
              const slotDateTime = dayjs(`${selectedDate} ${slot.time}`, 'YYYY-MM-DD hh:mm A');
              const isWithin2Hours = slotDateTime.diff(currentDateTime, 'minute') < 120;
              return {
                ...slot,
                available: !isWithin2Hours
              }
            });
            
        return { success: true, message: "Provider service availability fetched.", availability: { ...availability, slots: updatedSlots } };
    }
}