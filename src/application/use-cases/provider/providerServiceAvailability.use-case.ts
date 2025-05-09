import { Types } from "mongoose";
import { Validator } from "../../../infrastructure/validator/validator";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { ProviderFetchServiceAvailabilityResProps } from "../../../shared/interface/providerInterface";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { FrontendAvailabilityForRequest, TimeSlot } from "../../../domain/entities/serviceAvailability.entity";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";

export class ProviderAddServiceAvailabilitiesUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ){}

    async execute(providerId: string, availabilities: FrontendAvailabilityForRequest[]): Promise<CommonResponse> {
        if(!providerId || !availabilities || availabilities.length  === 0) throw new Error("Invalid request.");

        const convertedProviderId = new Types.ObjectId(providerId);
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
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
        
        const serviceAvailability = await this.serviceAvailabilityRepository.createServiceAvailabilities(convertedProviderId, newAvailabilities)
        if(!serviceAvailability) throw new Error("Service availability adding failed.");
        
        if (provider && serviceAvailability && serviceAvailability._id) {
            provider.serviceAvailabilityId = serviceAvailability._id;
            const updatedProvider = await this.providerRepository.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with service availability ID.");
        }

        return { success: true, message: "Service availability added successfuly." };
    }
}


export class ProviderFetchServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl) { }

    async execute(providerId: string, date: string): Promise<ProviderFetchServiceAvailabilityResProps> {
        if (!providerId || !date) throw new Error("Invalid request.");
        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId), new Date(date));
        if(availability === null) return { success: true, message: "Provider service availability not yet added.", availability: {} };
        if (!availability) throw new Error("Provider service availability fetching error.");
        return { success: true, message: "Provider service availability fetched.", availability };
    }
}